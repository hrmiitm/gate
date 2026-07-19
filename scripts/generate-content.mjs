import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { questionSeeds } from './question-seeds.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const L = String.raw;

const modules = [
  {
    subject: 'probability-statistics', subjectTitle: 'Probability & Statistics', module: 1,
    title: 'Counting & probability foundations', searchTerms: ['permutation', 'combination', 'axiom', 'independence', 'mutually exclusive', 'sample space'],
    introduction: 'Probability becomes much easier when you separate two jobs: count the outcomes correctly, then assign probability. Most traps in this module come from mixing order, replacement, or independence without saying so.',
    theory: ['Start by defining the experiment and its sample space. For equally likely outcomes, probability is favorable outcomes divided by total outcomes; outside that setting, use the axioms rather than counting.', 'Independence means learning one event occurred does not change the probability of the other. Mutual exclusivity means the events cannot occur together. Except for zero-probability edge cases, mutually exclusive events are not independent.'],
    formulas: [L`P(A^c)=1-P(A)`, L`P(A\cup B)=P(A)+P(B)-P(A\cap B)`, L`P(A\cap B)=P(A)P(B)\quad\text{if independent}`, L`{}^nP_r=\frac{n!}{(n-r)!},\qquad {n\choose r}=\frac{n!}{r!(n-r)!}`, L`\#\{x_1+\cdots+x_k=n,\ x_i\ge0\}={n+k-1\choose k-1}`],
    examples: [
      ['Order changes the count', 'Choose a president and secretary from 8 people.', 'The roles differ, so order matters: $8\times7=56$. Using ${8\choose2}$ would forget who holds which role.'],
      ['At least one', 'Find the probability of at least one six in four fair die rolls.', 'Use the complement. No six has probability $(5/6)^4$, so the answer is $1-(5/6)^4$.'],
      ['Exclusive is not independent', 'A fair die gives $A=\{1,2\}$ and $B=\{3,4\}$.', '$A\cap B=\varnothing$, but $P(A)P(B)=1/9\ne0$. They are mutually exclusive and dependent.'],
      ['Stars and bars', 'Count nonnegative integer solutions to $x+y+z=7$.', 'Place two bars among nine positions: ${9\choose2}=36$.']
    ],
    pitfalls: ['Using permutations when selected roles are interchangeable.', 'Multiplying probabilities without first establishing independence.', 'Calling disjoint positive-probability events independent.', 'Counting a non-uniform sample space as if every outcome were equally likely.'],
    whyGate: 'Counting and event algebra sit underneath discrete distributions, Bayes questions, randomized algorithms, and several General Aptitude problems.'
  },
  {
    subject: 'probability-statistics', subjectTitle: 'Probability & Statistics', module: 2,
    title: 'Conditional probability, joint distributions & Bayes', searchTerms: ['conditional', 'joint', 'marginal', 'bayes', 'total probability'],
    introduction: 'Conditional probability is probability after the sample space has been narrowed. Bayes’ theorem simply reverses the direction of that conditioning—powerful, but only when base rates stay visible.',
    theory: ['A joint distribution describes variables together. Sum or integrate out the unwanted variable to get a marginal; normalize a joint slice to get a conditional.', 'For diagnosis and classification, write the numerator and denominator before substituting. The denominator is the total probability of the evidence across every mutually exclusive cause.'],
    formulas: [L`P(A\mid B)=\frac{P(A\cap B)}{P(B)}`, L`P(A\cap B)=P(A\mid B)P(B)`, L`P(A_i\mid B)=\frac{P(B\mid A_i)P(A_i)}{\sum_jP(B\mid A_j)P(A_j)}`, L`p_X(x)=\sum_y p_{X,Y}(x,y)`, L`f_{X\mid Y}(x\mid y)=\frac{f_{X,Y}(x,y)}{f_Y(y)}`],
    examples: [
      ['Base rates matter', 'A disease has prevalence 1%, sensitivity 90%, and false-positive rate 5%. Find $P(D\mid +)$.', 'Bayes gives $0.9(0.01)/[0.9(0.01)+0.05(0.99)]\approx0.1538$. A positive result is not a 90% diagnosis.'],
      ['Marginalize', 'A joint PMF has $p(0,0)=.2,p(0,1)=.3,p(1,0)=.1,p(1,1)=.4$. Find $P(X=1)$.', 'Sum over $Y$: $0.1+0.4=0.5$.'],
      ['Reverse conditioning', '$P(A)=.4$, $P(B\mid A)=.5$, $P(B\mid A^c)=.2$. Find $P(A\mid B)$.', '$P(B)=.5(.4)+.2(.6)=.32$, hence $P(A\mid B)=.2/.32=.625$.'],
      ['Independence check', 'The same joint table has marginals $P(X=1)=.5$ and $P(Y=1)=.7$. Are $X,Y$ independent?', 'No. Independence would require $p(1,1)=.5(.7)=.35$, but the joint mass is $.4$.']
    ],
    pitfalls: ['Swapping $P(A\mid B)$ and $P(B\mid A)$.', 'Dropping the prior/base rate in Bayes’ theorem.', 'Marginalizing over the wrong support.', 'Checking only one cell before claiming two variables are independent.'],
    whyGate: 'Bayes is central to probabilistic reasoning, Naive Bayes, graphical models, and inference under uncertainty.'
  },
  {
    subject: 'probability-statistics', subjectTitle: 'Probability & Statistics', module: 3,
    title: 'Random variables & discrete distributions', searchTerms: ['pmf', 'bernoulli', 'binomial', 'poisson', 'discrete uniform', 'expectation'],
    introduction: 'A random variable turns outcomes into numbers; a PMF tells you how probability is distributed across those numbers. Learn each family by its experiment, not by a detached formula.',
    theory: ['Bernoulli models one success/failure trial. Binomial counts successes in a fixed number of independent identical trials. Poisson counts events in a fixed exposure when the rate is stable.', 'Expectation is linear even without independence. Variances add only when covariance terms vanish.'],
    formulas: [L`P(X=k)={n\choose k}p^k(1-p)^{n-k}\quad(X\sim Bin(n,p))`, L`P(X=k)=e^{-\lambda}\frac{\lambda^k}{k!}\quad(X\sim Pois(\lambda))`, L`E[X]=\sum_x xp_X(x)`, L`E[aX+b]=aE[X]+b`, L`Var(X)=E[X^2]-E[X]^2`],
    examples: [
      ['Binomial count', 'For $X\sim Bin(5,.2)$, find $P(X=2)$.', '${5\choose2}(.2)^2(.8)^3=0.2048$.'],
      ['Poisson additivity', '$X\sim Pois(2)$ and $Y\sim Pois(3)$ independently.', '$X+Y\sim Pois(5)$, because independent Poisson rates add.'],
      ['Linearity', '$E[X]=3$ and $E[Y]=4$. Find $E[2X-Y+5]$.', '$2(3)-4+5=7$. Independence is unnecessary.'],
      ['PMF constant', '$p(k)=c(k+1)$ for $k=0,1,2$.', 'Normalization gives $c(1+2+3)=1$, so $c=1/6$.']
    ],
    pitfalls: ['Treating Poisson as continuous—it is discrete.', 'Using a binomial model when trial probabilities differ.', 'Assuming linearity of variance the way expectation is linear.', 'Forgetting that a PMF must sum to one over its full support.'],
    whyGate: 'These models recur in likelihoods, classifiers, queue/event counts, and the sampling theory used later.'
  },
  {
    subject: 'probability-statistics', subjectTitle: 'Probability & Statistics', module: 4,
    title: 'Continuous distributions & CDFs', searchTerms: ['pdf', 'cdf', 'uniform', 'exponential', 'normal', 't distribution', 'chi square'],
    introduction: 'For a continuous variable, probability is area—not height. The CDF unifies discrete and continuous cases and often turns a difficult density question into endpoint arithmetic.',
    theory: ['A density may exceed one; only its integral must equal one. Single points carry zero probability for continuous variables.', 'The exponential distribution is memoryless. Normal standardization converts any normal probability into an area under the standard normal curve; t and chi-square distributions appear when estimating from normal samples.'],
    formulas: [L`F_X(x)=P(X\le x),\qquad f_X(x)=F_X'(x)`, L`P(a<X\le b)=F_X(b)-F_X(a)`, L`f(x)=\lambda e^{-\lambda x},\ x\ge0`, L`P(X>s+t\mid X>s)=P(X>t)`, L`Z=\frac{X-\mu}{\sigma}`],
    examples: [
      ['Normalize a density', '$f(x)=cx$ on $0<x<2$.', '$\int_0^2cx\,dx=2c=1$, so $c=1/2$.'],
      ['CDF from density', 'For that density, find $F(1)$.', '$F(1)=\int_0^1x/2\,dx=1/4$.'],
      ['Memorylessness', '$X\sim Exp(\lambda)$ and $P(X>5)=.3$. Find $P(X>10\mid X>5)$.', 'The remaining wait has the original distribution, so the answer is $P(X>5)=.3$.'],
      ['Standardize', '$X\sim N(10,4)$. Find $P(X\le12)$.', '$Z=(12-10)/2=1$, hence $P(X\le12)=\Phi(1)\approx.8413$.']
    ],
    pitfalls: ['Reading a density value as a probability.', 'Using variance instead of standard deviation when standardizing.', 'Applying memorylessness to non-exponential continuous distributions.', 'Ignoring endpoints for mixed/discrete distributions when reading a CDF.'],
    whyGate: 'CDF manipulation and standardization support inference, probabilistic ML, reliability, and sampling-distribution questions.'
  },
  {
    subject: 'probability-statistics', subjectTitle: 'Probability & Statistics', module: 5,
    title: 'Descriptive statistics & moments', searchTerms: ['mean', 'median', 'mode', 'variance', 'standard deviation', 'covariance', 'correlation', 'conditional expectation'],
    introduction: 'Summary statistics compress a dataset or distribution. The exam tests whether you know exactly what information survives that compression—and how location, scale, and dependence change under transformations.',
    theory: ['Mean is balance point, median is a quantile, and mode is peak frequency; they answer different questions. Variance measures squared spread around the mean.', 'Covariance captures linear co-movement and depends on units. Correlation standardizes it to $[-1,1]$ but zero correlation does not generally imply independence.'],
    formulas: [L`Var(X)=E[X^2]-E[X]^2`, L`Cov(X,Y)=E[XY]-E[X]E[Y]`, L`Corr(X,Y)=\frac{Cov(X,Y)}{\sigma_X\sigma_Y}`, L`Var(aX+b)=a^2Var(X)`, L`Var(X)=E[Var(X\mid Y)]+Var(E[X\mid Y])`],
    examples: [
      ['Shift and scale', '$Y=3X-2$, $E[X]=4$, $Var(X)=5$.', '$E[Y]=10$ and $Var(Y)=9(5)=45$; shifts do not affect variance.'],
      ['Covariance', '$E[X]=1,E[Y]=2,E[XY]=5$.', '$Cov(X,Y)=5-1\cdot2=3$.'],
      ['Update a mean', 'Five values average 8; append 14.', 'The old sum is 40, so the new mean is $(40+14)/6=9$.'],
      ['Total variance', '$E[Var(X\mid Y)]=2$ and $Var(E[X\mid Y])=3$.', '$Var(X)=2+3=5$.']
    ],
    pitfalls: ['Letting an additive shift change variance.', 'Treating zero correlation as independence without extra assumptions.', 'Using population and sample variance denominators interchangeably.', 'Forgetting the second term in the law of total variance.'],
    whyGate: 'These quantities drive standardization, regression, PCA covariance matrices, estimators, and uncertainty analysis.'
  },
  {
    subject: 'probability-statistics', subjectTitle: 'Probability & Statistics', module: 6,
    title: 'Central Limit Theorem & sampling distributions', searchTerms: ['clt', 'sample mean', 'standard error', 'law of large numbers', 'sampling'],
    introduction: 'The Central Limit Theorem describes the shape of a properly standardized sum or mean as sample size grows. It does not say the raw data become normal, and it does not erase assumptions.',
    theory: ['For iid observations with finite variance, the sample mean has mean $\mu$ and variance $\sigma^2/n$. Its standardized form approaches $N(0,1)$.', 'The law of large numbers is about convergence of the sample mean to $\mu$; the CLT describes the scale and approximate distribution of its fluctuations.'],
    formulas: [L`E[\bar X]=\mu,\qquad Var(\bar X)=\frac{\sigma^2}{n}`, L`\frac{\bar X-\mu}{\sigma/\sqrt n}\xrightarrow{d}N(0,1)`, L`\sum_{i=1}^nX_i\approx N(n\mu,n\sigma^2)`, L`SE(\bar X)=\frac{\sigma}{\sqrt n}`],
    examples: [
      ['Standard error', 'Population SD is 12 and $n=36$.', '$SE=12/6=2$.'],
      ['Sum approximation', 'iid variables have mean 2 and variance 9; $n=100$.', 'The sum is approximately $N(200,900)$, with standard deviation 30.'],
      ['Mean probability', '$\mu=50,\sigma=10,n=25$. Approximate $P(\bar X>54)$.', '$Z=(54-50)/(10/5)=2$, so the probability is about $0.0228$.'],
      ['Required size', 'Halve the standard error.', 'Because $SE\propto1/\sqrt n$, multiply sample size by $4$.']
    ],
    pitfalls: ['Saying the observations themselves become normal.', 'Using $\sigma/n$ instead of $\sigma/\sqrt n$ for standard error.', 'Forgetting variance of a sum grows with $n$.', 'Applying the usual CLT when variance is infinite or dependence is uncontrolled.'],
    whyGate: 'The CLT is the bridge from probability models to confidence intervals, tests, and large-sample ML estimates.'
  },
  {
    subject: 'probability-statistics', subjectTitle: 'Probability & Statistics', module: 7,
    title: 'Statistical inference', searchTerms: ['confidence interval', 'z test', 't test', 'chi squared', 'hypothesis', 'p value'],
    introduction: 'Inference turns a sample into a calibrated statement about a population. The core skill is choosing the statistic whose reference distribution matches the assumptions—not memorizing one universal test.',
    theory: ['A confidence interval is a procedure with long-run coverage. A p-value is the probability, under the null model, of a result at least as extreme as the observed one; it is not the probability that the null is true.', 'Use z when the relevant standard error is known or justified asymptotically, t when estimating a normal mean with unknown variance, and chi-square for variance or categorical count procedures.'],
    formulas: [L`\bar x\pm z_{\alpha/2}\frac{\sigma}{\sqrt n}`, L`t=\frac{\bar x-\mu_0}{s/\sqrt n}`, L`\chi^2=\sum\frac{(O-E)^2}{E}`, L`df_{\text{independence}}=(r-1)(c-1)`, L`\text{reject }H_0\text{ when }p\le\alpha`],
    examples: [
      ['Known-variance interval', '$\bar x=20,\sigma=4,n=16$, use $z^*=1.96$.', 'Margin $=1.96(4/4)=1.96$, so the interval is $(18.04,21.96)$.'],
      ['One-sample t', '$\bar x=12,\mu_0=10,s=4,n=16$.', '$t=(12-10)/(4/4)=2$ with 15 degrees of freedom.'],
      ['Table degrees of freedom', 'A $3\times4$ contingency table.', '$df=(3-1)(4-1)=6$.'],
      ['Interpret p', '$p=.03$ at $\alpha=.05$.', 'Reject $H_0$. This does not mean $P(H_0)=.03$.']
    ],
    pitfalls: ['Interpreting 95% confidence as a 95% posterior probability for a fixed parameter.', 'Using z instead of t for a small normal sample with unknown variance.', 'Accepting $H_0$ merely because it was not rejected.', 'Computing chi-square degrees of freedom from the number of cells.'],
    whyGate: 'Test selection and interpretation measure whether probability knowledge can support real statistical decisions.'
  },
  {
    subject: 'linear-algebra', subjectTitle: 'Linear Algebra', module: 1,
    title: 'Vector spaces, basis & dimension', searchTerms: ['vector space', 'subspace', 'span', 'independence', 'basis', 'dimension'],
    introduction: 'A vector space is a set where linear combinations stay legal. Most exam questions collapse once you ask two disciplined questions: what spans the set, and are those spanning vectors independent?',
    theory: ['For a subset of a known vector space, the zero vector plus closure under linear combinations is the efficient subspace test. Homogeneous linear constraints produce subspaces; nonzero offsets usually do not.', 'A basis is simultaneously spanning and linearly independent. Every basis of a finite-dimensional space has the same size, called the dimension.'],
    formulas: [L`\operatorname{span}\{v_1,\ldots,v_k\}=\left\{\sum_i\alpha_iv_i\right\}`, L`\sum_i\alpha_iv_i=0\Rightarrow\alpha_i=0\ \forall i\quad\text{(independence)}`, L`\dim(U+W)=\dim U+\dim W-\dim(U\cap W)`, L`\dim\mathbb R^n=n`],
    examples: [
      ['Subspace test', '$S=\{(x,y,z):x+y-z=0\}$.', 'It is the null space of $[1\ 1\ -1]$, hence contains zero and is closed under linear combinations.'],
      ['Dependence', '$v_3=2v_1-v_2$.', '$2v_1-v_2-v_3=0$ is a nontrivial relation, so the set is dependent.'],
      ['Build a basis', 'Solve $x+y-z=0$.', 'Write $(x,y,z)=x(1,0,1)+y(0,1,1)$; these two vectors are independent, so they form a basis.'],
      ['Dimension formula', '$\dim U=3,\dim W=4,\dim(U+W)=5$.', '$\dim(U\cap W)=3+4-5=2$.']
    ],
    pitfalls: ['Checking closure under addition but forgetting scalar multiplication.', 'Calling a spanning set a basis without checking independence.', 'Treating an affine plane not through the origin as a subspace.', 'Assuming more vectors always means a larger span.'],
    whyGate: 'Subspaces and dimension reappear as column spaces, null spaces, eigenspaces, projections, PCA subspaces, and model identifiability.'
  },
  {
    subject: 'linear-algebra', subjectTitle: 'Linear Algebra', module: 2,
    title: 'Matrices & special matrices', searchTerms: ['matrix', 'orthogonal', 'projection', 'idempotent', 'partition', 'symmetric'],
    introduction: 'Special matrices are compressed information: one property can determine eigenvalues, norms, inverses, or geometry without any entry-by-entry calculation.',
    theory: ['Orthogonal matrices preserve inner products and lengths. Projection matrices map every vector onto a fixed subspace; orthogonal projections are both idempotent and symmetric.', 'Block/partition multiplication follows ordinary multiplication provided block dimensions conform. Never assume blocks commute.'],
    formulas: [L`Q^TQ=I\Rightarrow Q^{-1}=Q^T`, L`P^2=P\quad\text{(idempotent)}`, L`P_A=A(A^TA)^{-1}A^T`, L`\|Qx\|_2=\|x\|_2`, L`\operatorname{tr}(P)=\operatorname{rank}(P)\quad\text{for a projection}`],
    examples: [
      ['Orthogonal inverse', '$Q^TQ=I$.', 'Multiplying by definition shows $Q^T$ is the inverse: $Q^{-1}=Q^T$.'],
      ['Line projection', 'Project onto the span of $a=(1,1)^T$.', '$P=aa^T/(a^Ta)=\frac12\begin{bmatrix}1&1\\1&1\end{bmatrix}$.'],
      ['Idempotent eigenvalues', '$Pv=\lambda v$ and $P^2=P$.', '$\lambda^2v=\lambda v$, so $\lambda\in\{0,1\}$.'],
      ['Block product', '$A=[B\ C]$ and $x=[u^T\ v^T]^T$.', 'Conforming multiplication gives $Ax=Bu+Cv$.']
    ],
    pitfalls: ['Assuming every idempotent matrix is symmetric.', 'Confusing $A^TA=I$ with $A^2=I$.', 'Using the projection formula when columns of $A$ are dependent.', 'Reordering block products as if matrix multiplication commuted.'],
    whyGate: 'Orthogonal transformations and projections are the geometry behind least squares, PCA, and stable numerical computation.'
  },
  {
    subject: 'linear-algebra', subjectTitle: 'Linear Algebra', module: 3,
    title: 'Linear systems, elimination, rank & nullity', searchTerms: ['linear system', 'gaussian elimination', 'rank', 'nullity', 'rref', 'consistency'],
    introduction: 'Gaussian elimination is not just a solving algorithm. Its pivots expose rank, free variables, consistency, and the entire geometry of a linear system in one pass.',
    theory: ['Elementary row operations preserve the solution set. In echelon form, pivots identify basic variables and non-pivot columns correspond to free variables.', 'A system $Ax=b$ is consistent exactly when $b$ lies in the column space of $A$, equivalently when $rank(A)=rank([A\mid b])$.'],
    formulas: [L`\operatorname{rank}(A)+\operatorname{nullity}(A)=n`, L`Ax=b\text{ consistent}\iff\operatorname{rank}(A)=\operatorname{rank}([A\mid b])`, L`\#\text{free variables}=n-\operatorname{rank}(A)`, L`A\in\mathbb R^{m\times n}:\ \operatorname{rank}(A)\le\min(m,n)`],
    examples: [
      ['Free variables', 'A $3\times5$ matrix has rank 3.', 'Nullity is $5-3=2$, so a homogeneous solution uses two free parameters.'],
      ['Inconsistency row', 'Elimination produces $[0\ 0\ 0\mid2]$.', 'This represents $0=2$, so no solution exists.'],
      ['Unique solution', '$A$ is square and has a pivot in every column.', '$rank(A)=n$, so nullity zero and $Ax=b$ has a unique solution for every $b$.'],
      ['Same row space', '$B$ is obtained from $A$ by row operations.', 'Row operations preserve row space dimension and rank, though they generally change the column space itself.']
    ],
    pitfalls: ['Using number of rows instead of number of columns in rank-nullity.', 'Saying row operations preserve the column space.', 'Calling a consistent system unique without checking free variables.', 'Missing an inconsistent augmented row.'],
    whyGate: 'Rank and solvability control regression uniqueness, redundant features, inverse problems, and low-dimensional representations.'
  },
  {
    subject: 'linear-algebra', subjectTitle: 'Linear Algebra', module: 4,
    title: 'Determinants', searchTerms: ['determinant', 'invertible', 'cofactor', 'volume', 'permutation'],
    introduction: 'The determinant is a signed volume-scaling factor. In exam problems, its transformation rules are usually more valuable than a long cofactor expansion.',
    theory: ['A zero determinant means the columns collapse volume and are dependent. Nonzero determinant is equivalent to invertibility for a square matrix.', 'Track row operations carefully: swaps flip sign, scaling a row scales the determinant, and adding a multiple of one row to another leaves it unchanged.'],
    formulas: [L`\det(AB)=\det(A)\det(B)`, L`\det(A^T)=\det(A)`, L`\det(A^{-1})=\frac1{\det(A)}`, L`\det(cA)=c^n\det(A)\quad(A\in\mathbb R^{n\times n})`, L`\det(A-\lambda I)=0\quad\text{characteristic equation}`],
    examples: [
      ['Triangular shortcut', '$A$ is triangular with diagonal $2,-1,4$.', '$\det A=2(-1)4=-8$.'],
      ['Row swap', '$B$ swaps two rows of $A$ and $\det A=5$.', '$\det B=-5$.'],
      ['Product', '$\det A=2,\det B=-3$.', '$\det(A^2B)=2^2(-3)=-12$.'],
      ['Scalar matrix', '$A$ is $3\times3$ with $\det A=4$.', '$\det(2A)=2^3\det A=32$.']
    ],
    pitfalls: ['Using $\det(A+B)=\det A+\det B$—this is false.', 'Scaling the determinant only once when the whole matrix is scaled.', 'Forgetting the sign change after a row swap.', 'Computing a large expansion when triangularization is faster.'],
    whyGate: 'Determinants connect invertibility, eigenvalues, change of variables, Gaussian models, and volume distortion.'
  },
  {
    subject: 'linear-algebra', subjectTitle: 'Linear Algebra', module: 5,
    title: 'Eigenvalues, eigenvectors & diagonalization', searchTerms: ['eigenvalue', 'eigenvector', 'diagonalization', 'trace', 'spectral'],
    introduction: 'An eigenvector is a direction a transformation does not rotate away from itself; its eigenvalue is the scaling along that direction. This viewpoint is faster and safer than treating the topic as determinant algebra alone.',
    theory: ['Eigenvalues solve $Av=\lambda v$ with $v\ne0$. Trace and determinant give quick consistency checks through the sum and product of eigenvalues.', 'A matrix is diagonalizable when it has enough independent eigenvectors. Every real symmetric matrix has an orthonormal eigenbasis and real eigenvalues.'],
    formulas: [L`\det(A-\lambda I)=0`, L`\operatorname{tr}(A)=\sum_i\lambda_i`, L`\det(A)=\prod_i\lambda_i`, L`A=PDP^{-1}\Rightarrow A^k=PD^kP^{-1}`, L`A=A^T\Rightarrow A=Q\Lambda Q^T`],
    examples: [
      ['Triangular spectrum', 'A triangular matrix has diagonal $1,3,3$.', 'Its eigenvalues are $1,3,3$ with algebraic multiplicity counted.'],
      ['Power quickly', '$A=P\,diag(2,1)P^{-1}$.', '$A^{10}=P\,diag(2^{10},1)P^{-1}$.'],
      ['Repeated eigenvalue', '$A=\begin{bmatrix}1&1\\0&1\end{bmatrix}$.', 'The eigenspace for 1 is one-dimensional, so this $2\times2$ matrix is not diagonalizable.'],
      ['Symmetric orthogonality', '$A=A^T$ has distinct eigenvalues.', 'Corresponding eigenvectors are orthogonal; after normalization they form part of an orthonormal basis.']
    ],
    pitfalls: ['Allowing the zero vector as an eigenvector.', 'Equating algebraic and geometric multiplicity automatically.', 'Assuming every matrix has real eigenvalues.', 'Confusing eigenvalues with singular values, which are always nonnegative.'],
    whyGate: 'This is the spectral engine behind PCA, covariance analysis, graph methods, dynamical systems, and optimization curvature.'
  },
  {
    subject: 'linear-algebra', subjectTitle: 'Linear Algebra', module: 6,
    title: 'Quadratic forms', searchTerms: ['quadratic form', 'positive definite', 'semidefinite', 'sylvester', 'hessian'],
    introduction: 'A quadratic form $x^TAx$ measures curvature and signed energy. Symmetry lets you read its behavior from eigenvalues or principal minors instead of testing infinitely many vectors.',
    theory: ['Only the symmetric part of a matrix affects $x^TAx$. Positive definiteness means the form is positive for every nonzero vector; semidefiniteness allows zero directions.', 'For real symmetric matrices, definiteness is determined by eigenvalue signs. Sylvester’s criterion uses leading principal minors for positive definiteness.'],
    formulas: [L`x^TAx=x^T\left(\frac{A+A^T}{2}\right)x`, L`A\succ0\iff\lambda_i(A)>0\ \forall i`, L`A\succeq0\iff\lambda_i(A)\ge0\ \forall i`, L`A\succ0\iff\Delta_1,\ldots,\Delta_n>0\quad(A=A^T)`, L`x^TAx=\sum_i\lambda_i y_i^2`],
    examples: [
      ['Two-variable form', '$q=2x^2+4xy+3y^2$.', '$A=\begin{bmatrix}2&2\\2&3\end{bmatrix}$. Leading minors are 2 and 2, so $A$ is positive definite.'],
      ['Indefinite', '$A=diag(2,-1)$.', '$q(1,0)=2>0$ and $q(0,1)=-1<0$, so the form is indefinite.'],
      ['Skew part vanishes', '$K^T=-K$.', '$x^TKx=-(x^TKx)^T$, so the scalar equals its negative and must be zero.'],
      ['Optimization link', 'A twice differentiable function has positive-definite Hessian at a stationary point.', 'The point is a strict local minimum.']
    ],
    pitfalls: ['Applying Sylvester’s criterion to a nonsymmetric representation without symmetrizing.', 'Calling a matrix positive definite because diagonal entries are positive.', 'Treating positive semidefinite as strictly positive.', 'Forgetting the factor of two in off-diagonal terms such as $2a_{12}xy$.'],
    whyGate: 'Quadratic forms encode loss curvature, covariance geometry, regularization, and second-order optimality.'
  },
  {
    subject: 'linear-algebra', subjectTitle: 'Linear Algebra', module: 7,
    title: 'LU decomposition & Singular Value Decomposition', searchTerms: ['lu', 'svd', 'singular value', 'pca', 'low rank', 'condition number'],
    introduction: 'LU makes repeated linear solves efficient; SVD reveals the geometry and effective rank of any rectangular matrix. Together they bridge symbolic linear algebra and numerical data science.',
    theory: ['LU factors elimination into a lower-triangular matrix and an upper-triangular matrix. Pivoting may be required, giving $PA=LU$.', 'SVD writes $A=U\Sigma V^T$. Singular values are square roots of eigenvalues of $A^TA$; truncating the SVD gives the best low-rank approximation in Frobenius and spectral norm.'],
    formulas: [L`A=LU\quad\text{or}\quad PA=LU`, L`A=U\Sigma V^T`, L`\sigma_i(A)=\sqrt{\lambda_i(A^TA)}`, L`\|A\|_F^2=\sum_i\sigma_i^2`, L`A_k=U_k\Sigma_kV_k^T`, L`\kappa_2(A)=\sigma_{max}/\sigma_{min}`],
    examples: [
      ['A $2\times2$ LU', '$A=\begin{bmatrix}2&1\\4&3\end{bmatrix}$.', 'Elimination multiplier is 2, so $L=\begin{bmatrix}1&0\\2&1\end{bmatrix}$ and $U=\begin{bmatrix}2&1\\0&1\end{bmatrix}$.'],
      ['Singular values', '$A=diag(3,-2)$.', '$A^TA=diag(9,4)$, so the singular values are 3 and 2—not 3 and −2.'],
      ['Rank from SVD', 'Singular values are $5,2,0,0$.', 'Exactly two are nonzero, so rank is 2.'],
      ['Best rank one', '$A=U\,diag(6,2,1)V^T$.', 'Keep only the leading triplet. The spectral-norm error is $\sigma_2=2$ and squared Frobenius error is $2^2+1^2=5$.']
    ],
    pitfalls: ['Assuming LU without pivoting always exists.', 'Giving singular values a negative sign.', 'Computing singular values from eigenvalues of $A$ instead of $A^TA$.', 'Confusing PCA directions (right singular vectors of centered data) with raw feature columns.'],
    whyGate: 'SVD is exactly the machinery behind PCA, low-rank approximation, pseudoinverses, compression, and stable least squares.'
  }
];

function repairMath(text) {
  return text.split('$').map((part, index) => {
    if (index % 2 === 0) return part;
    return part
      .replace(/\times/g, L`\times`)
      .replace(/\u0008egin/g, L`\begin`)
      .replace(/\u000barnothing/g, L`\varnothing`)
      .replace(/\f(?=rac)/g, L`\f`)
      .replace(/end\{bmatrix\}/g, L`\end{bmatrix}`)
      .replace(/(?<=\d)\\(?=[\d-])/g, L`\\`)
      .replace(/lambdain/g, L`\lambda\in`)
      .replace(/(?<!\\)(choose|cap|mid|approx|sim|lambda|Phi|cdot|sqrt|propto|alpha|dim)/g, L`\$1`)
      .replace(/\ne(?=[0-9])/g, L`\ne`)
      .replace(/(?<!\\)ne(?=[0-9])/g, L`\ne`)
      .replace(/le(?=[0-9])/g, L`\le`)
      .replace(/int(?=_)/g, L`\int`)
      .replace(/bar(?=\s*[A-Za-z])/g, L`\bar`)
      .replace(/(?<![A-Za-z])(mu|sigma)(?![A-Za-z])/g, L`\$1`)
      .replace(/(?<![A-Za-z\\])(det|diag|rank)(?=[ (A-Za-z])/g, L`\operatorname{$1}`)
      .replace(/,(?=\s*\\operatorname\{diag\})/g, '');
  }).join('$');
}

modules.forEach((module) => {
  module.examples = module.examples.map(([title, problem, solution]) => ({
    title: repairMath(title),
    problem: repairMath(problem),
    solution: repairMath(solution)
  }));
});

function normalizeSeed(seed, subject, moduleNumber, topic, index) {
  const prefix = subject === 'linear-algebra' ? 'la' : 'ps';
  const id = `${prefix}-${String(moduleNumber).padStart(2, '0')}-${String(index + 1).padStart(3, '0')}`;
  const difficulty = index < 7 ? 'foundation' : index < 16 ? 'gate-standard' : 'challenge';
  const type = seed.type || (seed.value !== undefined ? 'NAT' : 'MCQ');
  return {
    id, subject, module: moduleNumber, topic, type,
    marks: index < 7 ? 1 : 2, difficulty, source: 'original',
    question_latex: seed.question,
    ...(type === 'NAT' ? { correct: [], nat_answer: { value: seed.value, tolerance: seed.tolerance ?? 0.01 } } : { options: seed.options, correct: seed.correct, nat_answer: null }),
    solution_latex: seed.solution,
    common_mistake: seed.mistake
  };
}

const searchIndex = [];
const tests = [];
for (const module of modules) {
  const folder = resolve(root, 'data', module.subject);
  await mkdir(resolve(folder, 'questions'), { recursive: true });
  await writeFile(resolve(folder, `module-${module.module}.json`), JSON.stringify(module, null, 2) + '\n');
  const key = `${module.subject}:${module.module}`;
  const questions = questionSeeds[key].map((seed, index) => normalizeSeed(seed, module.subject, module.module, module.title, index));
  if (questions.length !== 20) throw new Error(`${key} must contain exactly 20 questions; found ${questions.length}`);
  await writeFile(resolve(folder, 'questions', `module-${module.module}.json`), JSON.stringify(questions, null, 2) + '\n');
  searchIndex.push({ kind: 'Theory', title: module.title, text: module.introduction, tags: module.searchTerms.join(' '), url: `subjects/module.html?subject=${module.subject}&module=${module.module}` });
  questions.forEach((question) => searchIndex.push({ kind: 'Question', title: question.topic, text: question.question_latex.replace(/\\[()[\]]/g, ''), tags: `${question.type} ${question.difficulty}`, url: `subjects/module.html?subject=${module.subject}&module=${module.module}#practice` }));
  tests.push({
    id: `topic-${module.subject}-${module.module}`,
    kind: 'topic', subject: module.subject, module: module.module,
    labelPrefix: `${module.subjectTitle} · Module ${module.module}`,
    title: module.title, minutes: module.module === 2 || module.module === 7 ? 20 : 18,
    questionIds: questions.slice(4, 16).map((question) => question.id)
  });
}

for (const subject of ['probability-statistics', 'linear-algebra']) {
  const subjectModules = modules.filter((module) => module.subject === subject);
  const prefix = subject === 'linear-algebra' ? 'la' : 'ps';
  tests.push({
    id: `subject-${subject}`, kind: 'subject', subject, labelPrefix: 'Subject test',
    title: subjectModules[0].subjectTitle, minutes: 45,
    questionIds: subjectModules.flatMap((module) => [3, 8, 13, 18].map((number) => `${prefix}-${String(module.module).padStart(2, '0')}-${String(number).padStart(3, '0')}`))
  });
}
tests.push({
  id: 'combined-phase-1', kind: 'combined', subject: 'phase-1', labelPrefix: 'Cumulative test',
  title: 'Probability & Statistics + Linear Algebra', minutes: 60,
  questionIds: modules.flatMap((module) => {
    const prefix = module.subject === 'linear-algebra' ? 'la' : 'ps';
    return [6, 12, 19].map((number) => `${prefix}-${String(module.module).padStart(2, '0')}-${String(number).padStart(3, '0')}`);
  }).slice(0, 40)
});
await mkdir(resolve(root, 'data', 'tests'), { recursive: true });
await writeFile(resolve(root, 'data', 'tests', 'index.json'), JSON.stringify(tests, null, 2) + '\n');
await writeFile(resolve(root, 'data', 'search-index.json'), JSON.stringify(searchIndex, null, 2) + '\n');
console.log(`Generated ${modules.length} modules, ${modules.length * 20} questions, ${tests.length} tests, and ${searchIndex.length} search entries.`);
