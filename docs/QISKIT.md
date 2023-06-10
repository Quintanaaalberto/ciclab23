
# Quantum Algebra

## Basic Notation

***"braket" notation*** -> or Dirak notation. Notation that identifies column vectors as *kets* and row vectors as *bras*, so the combination of both *bra* * *ket*, is spelled bracket.

*bra*:  ⟨ψ|

*ket*: |ψ⟩

***quantum state*** -> mathematical description that represents the physical state of a quantum system. Also known as *wavefunctions* or *kets*.

|ψ⟩ = α|0⟩ + β|1⟩

The quantum state even though it belongs to a complex space (*Hilbert Space*), is normalized meaning that the sum of the squared magnitude of the coefficients is 1. 


***quantum probability*** -> quantum of a simple *ket state* is calculated with the *braket operation* or the inner product.
![[Pasted image 20230529102728.png]]

![[Pasted image 20230529102702.png]]

***outer product*** -> This matrix tells us how State B can be transformed or projected onto State A.


## Multiple states:



## Quantum Circuits:

Here is how to specify a circuit in QISKIT

```python
from qiskit import QuantumCircuit

circuit = QuantumCircuit(1)

circuit.h(0)

circuit.s(0)

circuit.h(0)

circuit.t(0)

circuit.draw()
```

![[Pasted image 20230529124251.png]]
```python
from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister

X = QuantumRegister(1, "x")
Y = QuantumRegister(1, "y")
A = ClassicalRegister(1, "a")
B = ClassicalRegister(1, "b")
circuit = QuantumCircuit(Y, X, B, A)
circuit.h(Y)
circuit.cx(Y, X)


circuit.measure(Y, B)
circuit.measure(X, A)
circuit.draw()
```
![[Pasted image 20230529124343.png]]

The single bar cicuit line corresponds to a qubit, whereas a double line corresponds to a *classical bit*.

In this example:
1. The *quantum state*, *y*, is passed through an H transformation. (H being a *Hadamard Transformation*).
2. Depending on the controller quantum state y after the H trans. we do a *controlled not* operation CNOT over *x*.

| Classic transformation | Operation Description                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------- |
| Pauli-X Gate or NOT    | Flips the state of a qubit, analogous to the classical NOT operation.                   |
| Pauli-Y Gate           | Flips the qubit state, but also introduces a phase shift.                               |
| Pauli-Z Gate           | Introduces a phase flip without changing the amplitude. It is represented by the matrix |
| Hadamard Gate          | Creates a superposition by transforming the basis states.                               |
| CNOT or Controlled NOT | Performs a NOT operationon a target qubit if the control qubit is /1>                   |
| SWAP                   | Exchanges the states of two qubits. It is represented by the matrix.                    | 

There are some more controlled states that are similar to the previous.

---

## Limitations of Quantum Computing

1. **Irrelevance of global phases**: imaging that |$\psi$⟩ and |$\phi$⟩, are both unitary quantum state vectors. And that there exists a complex number $\alpha$, represented in polar as $e^{i\theta}$, and belonging to the unitary circle, where:

|$\psi$⟩ = $\alpha$ |$\phi$⟩

This means that when calculating the probability of either event ocurring on the same quantum state.

$|⟨a|\phi⟩|^2=|\alpha*⟨a|\psi⟩|^2$ and since alpha is a unitary polar value, we can assume: $|⟨a|\phi⟩|^2=|1*⟨a|\psi⟩|^2$ , 
>meaning that both states are indistinguishable from each other, when measured. 

This is true for ***global phases***, although the same does not apply to ***relative phase differences***, were the phase difference is applied to a limited subset of the entries.
![[Pasted image 20230529131850.png]]
![[Pasted image 20230529131906.png]]
In the case of *relative phases*, in this example, a simple ***Hadamard gate***, can solve the problem.

2. ***No-Cloning Theorem***: 
> it is impossible to create a clone of an unknown quantum state

No perfect cloning does not mean there can´t be an ***approximate cloning***.

For example, maybe they **randomly** generated a number **between 1 and 10**, but they didn't tell you how they generated that number. There's certainly no physical process through which you can obtain **two _independent_ copies** of that same probabilistic state: all you have in your hands is a number between 1 and 10, and there just isn't enough information.

3. ***Non-orthogonal states cannot be perfectly discriminated***:

Having two quantum states  |$\psi$⟩ and |$\phi$⟩, that are not orthogonal, which means that $⟨a|\phi⟩!=0$, it is impossible to discriminate (differentiate) perfectly.


---

## Entanglement:

### Quantum teleportation:

>Employs an ***e-bit*** to communicate information between Alice and Bob.

Given that the *no-cloning theorem* applies to quantum information. Communication between bob and alice through a *ebit* cannot be copied.

An *e-bit* is Alice has a qubit named **A**, Bob has a qubit named **B**, and together the pair **(A,B)** is in a quantum state.

![[Pasted image 20230529214300.png]]

1. Alice performs a CNOT on A controlled with Q. CNOT on the pair (A,Q), and then performs a Hadamard on Q.
2. Alice measures Q and A (standar measurements) and transmits the classical outcome to Bob. (*a* being the outcome of *A*, and *b* the outcome of *Q*).
3. IF:
	- a = 1, then performs a NOT operation on B
	- b = 1, then performs a Phase FLIP on B

Which results on the following relationships:
- 00 -> 1
- 01 -> Z
- 10 -> X
- 11 -> XZ

==**Teleportation** is not a quantum computing *application*, but a *Communications Protocol*==.

it is reasonable to speculate that teleportation **could one day become a standard way** to communicate quantum information. ==***Quantum Distillation***==

Finally, the **idea** behind teleportation and the way that it works is quite fundamental in quantum information and computation. It is a **cornerstone of quantum information theory**, and variations on the idea also often arise. As just one example, quantum gates **can** be implemented using teleportation, but where different initial states and measurements are chosen so that the outcome is to apply a chosen _operation_ rather than to communicate.

Here is a quantum circuit implementation of the teleportation protocol.

```python
from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
qubit = QuantumRegister(1, "Q")
ebit0 = QuantumRegister(1, "A")
ebit1 = QuantumRegister(1, "B")
a = ClassicalRegister(1, "a")
b = ClassicalRegister(1, "b")

protocol = QuantumCircuit(qubit, ebit0, ebit1, a, b)

# Prepare ebit used for teleportation
protocol.h(ebit0)
protocol.cx(ebit0, ebit1)
protocol.barrier()

# Alice's operations
protocol.cx(qubit, ebit0)
protocol.h(qubit)
protocol.barrier()

# Alice measures and sends classical bits to Bob
protocol.measure(ebit0, a)
protocol.measure(qubit, b)
protocol.barrier()

# Bob uses the classical bits to conditionally apply gates
with protocol.if_test((a, 1)):
    protocol.x(ebit1)
with protocol.if_test((b, 1)):
    protocol.z(ebit1)

protocol.draw()
```
![[Pasted image 20230529223244.png]]

1. Alice and Bob, perform the necessary prerequisites to be at the state $|\phi^+⟩$ at the end of the the first *barrier*.
2. Then performs the necessary AQ operations for teleportation until the second *barrier*.
3. The measures are taken through to both *a* and *b* as defined in the algorithm
4. Then conditionally applied to B through the if_else gates.

```python
# Create a new circuit including the same bits and qubits used in the
# teleportation protocol, along with a new "auxiliary" qubit R.
aux = QuantumRegister(1, "R")
test = QuantumCircuit(aux, qubit, ebit0, ebit1, a, b)

# Entangle Q with R
test.h(aux)
test.cx(aux, qubit)
test.barrier()

# Append the protocol the circuit. The 'qubits' argument tells Qiskit that
# the protocol should operate on the qubits numbered 1, 2, and 3 (skipping
# qubit 0, which is R).
test = test.compose(protocol, qubits=[1, 2, 3])
test.barrier()

# After the protocol runs, check that (B,R) is in a phi+ state. We can add
# a new classical bit to the circuit to do this.
test.cx(aux, ebit1)
test.h(aux)
result = ClassicalRegister(1, "Test result")
test.add_register(result)
test.measure(aux, result)

test.draw()
```
![[Pasted image 20230530093437.png]]

When implementing this new method with a control qubit. This new state R, is entangled with Q at the very beginning. 

Meaning that **if the transfer is successful** then the qubit **R should measure 0**.

```python
from qiskit_aer import AerSimulator
from qiskit.visualization import plot_histogram

counts = AerSimulator().run(test).result().get_counts()
plot_histogram(counts)
```

![[Pasted image 20230530100230.png]]

```python
filtered_counts = {"0": 0, "1": 0}

# filtering the count for the test result classical bit allows us to check for correct teleportation more clearly
for result, frequency in counts.items():
    filtered_counts[result[0] ] += frequency

plot_histogram(filtered_counts)
```

![[Pasted image 20230530100257.png]]


### Superdense Coding:

> It is in some sense a complimentary approach to *teleportation*, allowing the transmission of a pair of classical bit states *(a b)* through the use of quantum information. In particular a the cost of an entangled *e-bit*, *(A B)*.

![[Pasted image 20230530112735.png]]

1. Alice checks the first *b* bit and *a* bit
2. If *b = 1*, then performs a Z (Flip) on A, and if *a = 1* performs a NOT on A
3. Bob then Executes a CNOT on BA and a Hadamard on A.
4. Measures *a and b* 

The idea behind this protocol is pretty simple: Alice effectively chooses which Bell state she would like to be sharing with Bob, she sends Bob her qubit, and Bob measures to determine which Bell state Alice chose.

```python
a = "1"
b = "0"

from qiskit import QuantumCircuit

protocol = QuantumCircuit(2)

# Prepare ebit used for superdense coding
protocol.h(0)
protocol.cx(0, 1)
protocol.barrier()

# Alice's operations

if b == "1":
    protocol.z(0)
if a == "1":
    protocol.x(0)
protocol.barrier()

# Bob's actions
protocol.cx(0, 1)
protocol.h(0)
protocol.measure_all()

protocol.draw()
```

![[Pasted image 20230530125101.png]]

```python
from qiskit_aer import AerSimulator
from qiskit.visualization import plot_histogram

counts = AerSimulator().run(protocol).result().get_counts()

for outcome, frequency in counts.items():
    print(f"Measured {outcome} with frequency {frequency}")
plot_histogram(counts)
```
![[Pasted image 20230530125123.png]]


## The CHSH Game

Game theory and quantum mechanics explain the possibility to solve **non-local game theory** games through the use of quantum computing.

**Non-local games** -> uncertainty in the decisions of both agents and uncertainty in the "questions" poised.

**Description of the game**:
1. The questions and answers are all classical bits, *x,y,a,b* -> (0,1)
2. The "questions" are chosen with a uniform random probability distribution. Meaning that each possibility can have 1/4 chance of happening

$(x,y) \in [(0,0), (0,1), (1,0), (1,1)]$

3. The winning conditions are established for each pair. Meaning that for each pair of *(x,y)* there is only one possible *(a,b)* to succeed.

| $(x,y)$ | win       | lose      |
| ------- | --------- | --------- |
| $(0,0)$ | $a=b$     | $a\not=b$ |
| $(0,1)$ | $a=b$     | $a\not=b$ |
| $(1,0)$ | $a=b$     | $a\not=b$ |
| $(1,1)$ | $a\not=b$ | $a=b$     | 

> It is impossible to determine the result with more than 75% accuracy through deterministic or probabilistic methods, but if they previously shared and **entangled initial state**, the quantum resolution improves upon the deterministic or probabilistic counterparts.

(...)
[Explanation](https://learn.qiskit.org/course/basics/entanglement-in-action#entanglement-16-0)

```python
from numpy.random import randint

def chsh_game(strategy):
    """Plays the CHSH game
    Args:
        strategy (callable): A function that takes two bits (as `int`s) and
            returns two bits (also as `int`s). The strategy must follow the
            rules of the CHSH game.
    Returns:
        int: 1 for a win, 0 for a loss.
    """
    # Referee chooses x and y randomly
    x, y = randint(0, 2), randint(0, 2)

    # Use strategy to choose a and b
    a, b = strategy(x, y)

    # Referee decides if Alice and Bob win or lose
    if (a != b) == (x & y):
        return 1  # Win
    return 0  # Lose
```

Now we'll create a function that outputs a circuit depending on the questions for Alice and Bob. We'll let the qubits have their default names for simplicity, and we'll use the built-in gate for Alice and Bob's actions.

```python
from qiskit import QuantumCircuit
from numpy import pi

def chsh_circuit(x, y):
    """Creates a `QuantumCircuit` that implements the best CHSH strategy.
    Args:
        x (int): Alice's bit (must be 0 or 1)
        y (int): Bob's bit (must be 0 or 1)
    Returns:
        QuantumCircuit: Circuit that, when run, returns Alice and Bob's
            answer bits.
    """
    qc = QuantumCircuit(2, 2)
    qc.h(0)
    qc.cx(0, 1)
    qc.barrier()

    # Alice
    if x == 0:
        qc.ry(0, 0)
    else:
        qc.ry(-pi / 2, 0)
    qc.measure(0, 0)

    # Bob
    if y == 0:
        qc.ry(-pi / 4, 1)
    else:
        qc.ry(pi / 4, 1)
    qc.measure(1, 1)

    return qc
```

```python
from qiskit_aer import AerSimulator

simulator = AerSimulator()


def quantum_strategy(x, y):
    """Carry out the best strategy for the CHSH game.
    Args:
        x (int): Alice's bit (must be 0 or 1)
        y (int): Bob's bit (must be 0 or 1)
    Returns:
        (int, int): Alice and Bob's answer bits (respectively)
    """
    # `shots=1` runs the circuit once
    # `memory=True` enables the `.get_memory()` method
    job = simulator.run(chsh_circuit(x, y), shots=1, memory=True)
    result = job.result().get_memory()[0]
    a, b = result[0], result[1]
    return a, b
```

```python
# Draw the four possible circuits

print("(x,y) = (0,0)")
display(chsh_circuit(0, 0).draw())

print("(x,y) = (0,1)")
display(chsh_circuit(0, 1).draw())

print("(x,y) = (1,0)")
display(chsh_circuit(1, 0).draw())

print("(x,y) = (1,1)")
display(chsh_circuit(1, 1).draw())
```
![[Pasted image 20230530133045.png]]
![[Pasted image 20230530133107.png]]

```python
from qiskit_aer import AerSimulator

simulator = AerSimulator()


def quantum_strategy(x, y):
    """Carry out the best strategy for the CHSH game.
    Args:
        x (int): Alice's bit (must be 0 or 1)
        y (int): Bob's bit (must be 0 or 1)
    Returns:
        (int, int): Alice and Bob's answer bits (respectively)
    """
    # `shots=1` runs the circuit once
    # `memory=True` enables the `.get_memory()` method
    job = simulator.run(chsh_circuit(x, y), shots=1, memory=True)
    result = job.result().get_memory()[0]
    a, b = result[0], result[1]
    return a, b
```

```python
NUM_GAMES = 1000
TOTAL_SCORE = 0

for _ in range(NUM_GAMES):
    TOTAL_SCORE += chsh_game(quantum_strategy)

print("Fraction of games won:", TOTAL_SCORE / NUM_GAMES)
```

```python
def classical_strategy(x, y):
    """The best classical strategy for the CHSH game
    Args:
        x (int): Alice's bit (must be 0 or 1)
        y (int): Bob's bit (must be 0 or 1)
    Returns:
        (int, int): Alice and Bob's answer bits (respectively)
    """
    # Alice's answer
    if x == 0:
        a = 0
    elif x == 1:
        a = 1

    # Bob's answer
    if y == 0:
        b = 1
    elif y == 1:
        b = 0

    return a, b
```

```python
NUM_GAMES = 1000
TOTAL_SCORE = 0

for _ in range(NUM_GAMES):
    TOTAL_SCORE += chsh_game(classical_strategy)

print("Fraction of games won:", TOTAL_SCORE / NUM_GAMES)
```