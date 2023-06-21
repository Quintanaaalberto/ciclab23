import time
import numpy as np
import networkx as nx
import matplotlib.pyplot as plt
from docplex.mp.model import Model
from qiskit_optimization.translators import from_docplex_mp
from qiskit.utils import algorithm_globals, QuantumInstance
from qiskit import Aer, execute, QuantumCircuit
from qiskit.algorithms.minimum_eigensolvers import QAOA
from qiskit_optimization.algorithms import MinimumEigenOptimizer
from qiskit.algorithms.optimizers import COBYLA
# from qiskit.primitives import Sampler
from qiskit_optimization.converters.quadratic_program_to_qubo import QuadraticProgramToQubo

from qiskit_ibm_runtime import Estimator, Sampler, Session

import logging

logging.basicConfig(level=logging.DEBUG)

# ----------------------------------------------------------------------------------------------------------------------
# PREPARING THE TSP PROBLEM:

n = 4  # establish the number of nodes for TSP

coordinates = np.random.default_rng(123).uniform(low=0, high=100, size=(n, 2))
# create a random distribution of nodes in a grid (coordinates)
pos = dict()
for i, coordinate in enumerate(coordinates):
    pos[i] = (coordinate[0], coordinate[1])

high = 100
low = 0
graph = nx.random_geometric_graph(n=n, radius=np.sqrt((high - low) ** 2 + (high - low) ** 2) + 1, pos=pos)

for w, v in graph.edges:
    delta = []
    for i in range(2):
        delta.append(graph.nodes[w]["pos"][i] - graph.nodes[v]["pos"][i])
    graph.edges[w, v]["weight"] = np.rint(np.sqrt(delta[0] ** 2 + delta[1] ** 2))

index = dict(zip(list(graph), range(n)))
A = np.full((n, n), np.nan)
for u, wdict in graph.adjacency():
    for v, d in wdict.items():
        A[index[u], index[v]] = d.get("weight", 1)

A[np.isnan(A)] = 0.0
A = np.asarray(A)
M = np.asmatrix(A)
print(M)


# defining the graph drawing fucntion
def draw_graph(G, colors, pos):
    default_axes = plt.axes(frameon=True)
    nx.draw_networkx(G, node_color=colors, node_size=600, alpha=.8, ax=default_axes, pos=pos)
    edge_labels = nx.get_edge_attributes(G, "weight")
    nx.draw_networkx_edge_labels(G, pos=pos, edge_labels=edge_labels)


colors = ["r" for node in graph.nodes]
pos = [graph.nodes[node]["pos"] for node in graph.nodes]
draw_graph(graph, colors, pos)

# ----------------------------------------------------------------------------------------------------------------------
# DEFINING THE OPTIMIZATION PROBLEM (TSP):

mdl = Model(name="TSP")  # establishing a model

# defining the matrix tha connects the different nodes of the network
x = dict()
for i in range(n):
    for j in range(n):
        x[(i, j)] = mdl.binary_var(name="x_{0}_{1}".format(i, j))

# defines the cost function being a product of all possible paths and the distances
C_x = mdl.sum(
    M[i, j] * x[(i, k)] * x[(j, (k + 1) % n)]
    for i in range(n)
    for j in range(n)
    for k in range(n)
    if i != j
)

# establishes that the goal is to minimize the cost function
mdl.minimize(C_x)

# establishes the main constraint of the optimization problem, being that each node is visited once (first loop) and is
# left once (second loop)
for i in range(n):
    mdl.add_constraint(mdl.sum(x[i, p] for p in range(n)) == 1)
for p in range(n):
    mdl.add_constraint(mdl.sum(x[i, p] for i in range(n)) == 1)

# ----------------------------------------------------------------------------------------------------------------------
# TRANSFORMING THE QUADRATIC PROBLEM


qp = from_docplex_mp(mdl)  # transforms the quadratic problem into a qiskit optimization QUADRATIC PROBLEM
qubo = QuadraticProgramToQubo().convert(problem=qp)  # the quantum problem is now converted into a Quadratic
# Unconstrained Binary Optimization problem so we can later apply Quantum Optimization Solvers


def route_x(x):
    # "route_x" is a special tool that will help us later! ;)
    # it searches a matrix of binary solutions to determine which nodes are joined in the solution and thus what is the
    # shortest route
    n = int(np.sqrt(len(x)))  # determines the grid size by taking the root square of the x length
    route = []  # creates a route list
    for p in range(n):  # iterates through the solution looking for the joined nodes and adding them to the list
        for i in range(n):
            if x[i * n + p]:
                route.append(i)

    return route


algorithm_globals.random_seed = 10598

def optimizer_call(qubo, session):

    qaoa_mes = QAOA(sampler=Sampler(session = session), optimizer=COBYLA(), )
    qaoa = MinimumEigenOptimizer(qaoa_mes)
    # qaoa_result = qaoa.solve(qubo)
    qaoa_result = qaoa.run(qubo, backend=backend)
    print("\nQAOA:\n", qaoa_result)
    qaoa_result = np.asarray([int(y) for y in reversed(list(qaoa_result))])
    print("\nRoute\n", route_x(qaoa_result))

    return


# Quantum Instance creates a iteration of Qiskit Terra that stores the employed backend
# quantum_instance = QuantumInstance(Aer.get_backend("qasm_simulator"), seed_simulator=algorithm_globals.random_seed,
#                                  seed_transpiler=algorithm_globals.random_seed)
backend = Aer.get_backend('qasm_simulator')

opt_start_time = time.time()


session = Session(backend=backend)
optimizer_call(qubo=qubo, session=session)

opt_end_time = time.time()
execution_time = opt_end_time - opt_start_time
logging.debug("optimizer execution time on sim: {:.2f} seconds".format(execution_time))

# ----------------------------------------------------------------------------------------------------------------------
# TRYING ON A QUANTUM BACKEND

from qiskit_ibm_runtime import QiskitRuntimeService

IBM_API = "a998d08dcbe837698586eebef6b0bd5f6edb78e05a74cdd944ace2636e41329ffa39585a8f923c4145d02caf3931e2fd9c9b788164a7d0097795289c931ef872"

service = QiskitRuntimeService(token=IBM_API)
backend = service.least_bussy(simulator=True, operational=True, min_num_qubits=10)

opt_start_time = time.time()

session = Session(backend=backend)
optimizer_call(qubo=qubo, session=session)

opt_end_time = time.time()
execution_time = opt_end_time - opt_start_time
logging.debug("optimizer execution time on backend: {:.2f} seconds".format(execution_time))

# opt_start_time = time.time()
#
# # Get the optimized circuit from the QAOA result
# optimized_circuit = qaoa.get_optimal_circuit()
# # optimized_circuit = qaoa_mes._ret['optimal_circuit']
#
# # Run the optimized circuit on the backend
# job = execute(optimized_circuit, backend)
# # Obtain the result of the job
# result = job.result()
# # Get the counts (measurement outcomes) from the result
# counts = result.get_counts()
#
# opt_end_time = time.time()
# execution_time = opt_end_time - opt_start_time
#
# # Print the measurement outcomes
# print(counts)
# print("Backend execution time: {:.2f} seconds".format(execution_time))
#
