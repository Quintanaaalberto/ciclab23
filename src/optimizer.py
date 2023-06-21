from qiskit import *
from qiskit import IBMQ
from qiskit.compiler import transpile, assemble
from qiskit.tools.jupyter import *
from qiskit.visualization import *
import numpy as np
import matplotlib.pyplot as plt
from matplotlib import style
from PIL import Image
from math import log2
import time

backend = Aer.get_backend("statevector_simulator")


# Outputs the image in a graph
def plot_image(image_np_array, original_side_length, title: str):
    plt.title(title)
    plt.xticks(range(0, image_np_array.shape[0] + 1, original_side_length))
    plt.yticks(range(0, image_np_array.shape[1] + 1, original_side_length))
    plt.imshow(
        image_np_array,
        extent=[0, image_np_array.shape[0], image_np_array.shape[1], 0],
        cmap="viridis",
    )
    plt.show()


# Splits the image into squares of new_side_length
def split_image(image_np_array, new_side_length):
    total_size = image_np_array.shape[
        0
    ]  # Since the images are squares, we use one side

    small_arrays = []  # 2D array of partitioned image

    for i in range(int(total_size / new_side_length)):
        for j in range(int(total_size / new_side_length)):
            # Calculate the starting and ending indices for each smaller array
            start_row = i * new_side_length
            end_row = start_row + new_side_length
            start_col = j * new_side_length
            end_col = start_col + new_side_length

            # Append the smaller array to the list
            small_arrays.append(image_np_array[start_row:end_row, start_col:end_col])

    return small_arrays


# Encode amplitude so that the probability of states adds up to 1
def amplitude_encode(image_np_array):
    # Calculate the RMS value
    rms = np.sqrt(np.sum(np.sum(image_np_array ** 2, axis=1)))

    # Create normalized image
    image_normalized = []
    for arr in image_np_array:
        for ele in arr:
            image_normalized.append(ele / rms)

    # Return the normalized image as a numpy array (It is a 1D array)
    return np.array(image_normalized)


def build_image_circuits(total_qubits, normalized_horizontal, normalized_vertical, APU):
    # APU means Amplitude Permutation Unitary matrix
    # Create the circuit for horizontal scan
    qc_h = QuantumCircuit(total_qubits)
    qc_h.initialize(normalized_horizontal, range(1, total_qubits))
    qc_h.h(0)
    qc_h.unitary(APU, range(total_qubits))
    qc_h.h(0)

    # Create the circuit for vertical scan
    qc_v = QuantumCircuit(total_qubits)
    qc_v.initialize(normalized_vertical, range(1, total_qubits))
    qc_v.h(0)
    qc_v.unitary(APU, range(total_qubits))
    qc_v.h(0)

    # Combine both circuits into a single list
    circ_list = [qc_h, qc_v]

    return circ_list


def image_edge_finder(
        image_np_array,
        total_qubits,
        data_qubits,
        dimension,
        calibration_constant,
        backend=backend,
):
    # STEP 1: obtain the encoding for the horizontal and vertical dimensions of the image
    normalized_horizontal = amplitude_encode(image_np_array)
    normalized_vertical = amplitude_encode(image_np_array.T)

    # STEP 2: construimos el circuito de analisis para cada uno de los siguientes encodeos
    # Initialize the amplitude permutation unitary, APU => D2n_1
    APU = np.roll(np.identity(2 ** total_qubits), 1, axis=1)
    # APU means Amplitude Permutation Unitary matrix
    # Create the horizontal and vertical scan circuits
    circ_list = build_image_circuits(
        total_qubits, normalized_horizontal, normalized_vertical, APU
    )

    # STEP 3: codigo para obtener el vector de estado de cada uno de los circuitos obtenidos
    # extract the results and the statevectors
    results = execute(circ_list, backend=backend).result()
    statevector_horizontal = results.get_statevector(circ_list[0])
    statevector_vertical = results.get_statevector(circ_list[1])

    # STEP 4: obtención del borde de la imagen
    # Defining a lambda function for
    # thresholding to binary values
    threshold = lambda amp: (
            amp > 10 ** ((-1) * float(calibration_constant))
            or amp < -(10 ** ((-1) * float(calibration_constant)))
    )
    # Selecting odd states from the raw statevector and
    # reshaping column vector of size 64 to an 8x8 matrix
    edge_scan_h = np.abs(
        np.array(
            [
                1 if threshold(statevector_horizontal[2 * i + 1].real) else 0
                for i in range(2 ** data_qubits)
            ]
        )
    ).reshape(dimension, dimension)
    edge_scan_v = (
        np.abs(
            np.array(
                [
                    1 if threshold(statevector_vertical[2 * i + 1].real) else 0
                    for i in range(2 ** data_qubits)
                ]
            )
        )
        .reshape(dimension, dimension)
        .T
    )

    # STEP 5: union en la imagen original
    # Combining the horizontal and vertical component of the result
    edge_scan_sim = edge_scan_h | edge_scan_v

    return edge_scan_sim


def reconstruct_image(small_arrays, original_side_length, new_side_length):
    # Initialize an empty array for the reconstructed image
    output_image_np_array = np.empty(
        (original_side_length, original_side_length), dtype=small_arrays[0].dtype
    )

    side_length_ratio = int(original_side_length / new_side_length)

    # Iterate over the smaller arrays and place them in the appropriate positions in the image array
    for i in range(side_length_ratio ** 2):
        # Calculate the row and column indices for placing the smaller array
        row_idx = i // side_length_ratio
        col_idx = i % side_length_ratio

        # Calculate the starting and ending indices for placing the smaller array
        start_row = row_idx * new_side_length
        end_row = start_row + new_side_length
        start_col = col_idx * new_side_length
        end_col = start_col + new_side_length

        # Place the smaller array into the corresponding position in the image array
        output_image_np_array[start_row:end_row, start_col:end_col] = small_arrays[i]

    return output_image_np_array


def show_images(small_arrays, original_side_length, new_side_length):
    small_array_processed = []

    for element in small_arrays:
        small_array_processed.append(
            image_edge_finder(
                image_np_array=element,
                total_qubits=total_qubits,
                data_qubits=data_qubits,
                dimension=new_side_length,
                backend=backend,
                calibration_constant=2,
            )
        )

    # reconstructing of the image and plotting
    processed_image = reconstruct_image(
        small_array_processed, original_side_length, new_side_length
    )
    # plotting both the original image and the new one
    plot_image(processed_image, original_side_length, "Edge Detected image")


style.use("bmh")
style.use("default")

original_side_length = 256  # Original image-width (1 dimension)

new_side_length = 8

# Load the image from filesystem
image_raw = np.array(Image.open("image.jpg"))

# Convert the RBG component of the image to B&W image, as a numpy (uint8) array
image = []  # 2D array
for i in range(original_side_length):
    image.append([])
    for j in range(original_side_length):
        image[i].append(image_raw[i][j][0] / 255)

image_np_array = np.array(image)  # 2D numpy Array

start_time = time.perf_counter()

small_arrays = split_image(image_np_array, new_side_length)

# Initialize some global variable for number of qubits
data_qubits = int(log2(new_side_length ** 2))
anc_qubits = 1
total_qubits = data_qubits + anc_qubits

show_images(small_arrays, original_side_length, new_side_length)

end_time = time.perf_counter()

elapsed_time = end_time - start_time
print(f"{new_side_length} Pixels   ---> Elapsed time: {elapsed_time} seconds")
