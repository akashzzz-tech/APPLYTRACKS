import { Application, ApplicationStatus, DeadlineItem, PrepTask, Profile, Resume, ActivityLog, SupportTicket, AdminAnnouncement } from '@/types';
import { createClient } from './supabase/client';

// Initial curated interview preparation questions with comprehensive Q&A and code snippets
export const INITIAL_PREP_TOPICS: Omit<PrepTask, 'id' | 'user_id' | 'created_at'>[] = [
  // ==================== PYTHON ====================
  {
    category: 'Python',
    title: 'List Comprehensions vs Generators & Memory',
    question_or_topic: 'Explain the internal memory and performance difference between list comprehensions and generator expressions in Python.',
    answer: 'A list comprehension `[x*2 for x in range(1000000)]` creates the entire list object in memory immediately, allocating space for all 1,000,000 elements at once (consuming tens of megabytes). In contrast, a generator expression `(x*2 for x in range(1000000))` returns a generator object that evaluates lazily using the Python iterator protocol (`__iter__()` and `__next__()`). It generates one value on the fly upon each iteration and keeps only the current state in memory, taking a constant O(1) memory overhead (~100 bytes). Use generators for streaming large datasets, file processing, or infinite sequences.',
    code_snippet: `# Memory comparison in Python:
import sys

list_comp = [x ** 2 for x in range(1000000)]
gen_exp = (x ** 2 for x in range(1000000))

print("List memory:", sys.getsizeof(list_comp), "bytes")  # ~8.4 MB
print("Gen memory:", sys.getsizeof(gen_exp), "bytes")     # ~104 bytes`,
    key_takeaways: [
      'List comprehension: Eager evaluation, O(N) memory, faster for small lists when indexing is needed.',
      'Generator: Lazy evaluation with `yield`, O(1) memory, optimal for large pipelines and streaming.',
    ],
    notes: 'Remember `sys.getsizeof` to demonstrate memory awareness during technical rounds.',
    is_completed: false,
    priority: 'High',
  },
  {
    category: 'Python',
    title: 'Global Interpreter Lock (GIL) & Concurrency',
    question_or_topic: 'What is the Python Global Interpreter Lock (GIL), why does it exist in CPython, and how do you achieve true parallelism for CPU-bound tasks?',
    answer: 'The GIL is a mutex that prevents multiple native OS threads from executing Python bytecodes simultaneously within a single CPython process. It was introduced primarily because CPython uses reference counting for memory management, which would suffer race conditions and require expensive fine-grained locking without the GIL. Because of the GIL, multithreading in Python does NOT speed up CPU-bound tasks (e.g., matrix multiplication or image processing). However, for I/O-bound tasks (network requests, DB queries, reading files), multithreading or `asyncio` works great because threads release the GIL while waiting on I/O. For CPU-bound parallelism, use Python\'s `multiprocessing` module (which spawns separate processes each with its own interpreter and memory space) or native C/Rust extensions.',
    code_snippet: `from multiprocessing import Pool
import time

def cpu_heavy_task(n):
    return sum(i * i for i in range(n))

if __name__ == '__main__':
    # Bypasses the GIL by spawning worker processes across multi-core CPU
    with Pool(processes=4) as pool:
        results = pool.map(cpu_heavy_task, [10000000, 10000000, 10000000, 10000000])`,
    key_takeaways: [
      'GIL allows only one thread to execute Python bytecode at a time per process.',
      'I/O-Bound: Use `threading` or `asyncio` (cooperative multitasking).',
      'CPU-Bound: Use `multiprocessing` to utilize all CPU cores.',
    ],
    notes: 'Mention Python 3.13 free-threaded build (PEP 703) if asked about modern Python roadmaps.',
    is_completed: false,
    priority: 'High',
  },
  {
    category: 'Python',
    title: 'Decorators & Closures with @functools.wraps',
    question_or_topic: 'Write a custom decorator `@retry(max_attempts=3)` or `@timer` and explain how closures preserve state and why `@wraps` is necessary.',
    answer: 'A decorator is a callable that takes a function as an argument and returns a modified wrapper function. It relies on Python closures (an inner function that retains access to variables from its enclosing lexical scope even after the outer function has completed). `@functools.wraps` is critical because without it, the decorated function loses its original metadata such as `__name__`, `__doc__`, and signature (they get overwritten by the wrapper\'s name), breaking debugging tools and documentation generators.',
    code_snippet: `import time
from functools import wraps

def timer(func):
    """Decorator that measures execution time of any function."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.perf_counter()
        result = func(*args, **kwargs)
        end_time = time.perf_counter()
        print(f"Function {func.__name__} took {end_time - start_time:.4f}s")
        return result
    return wrapper

@timer
def heavy_computation():
    return sum(range(1000000))`,
    key_takeaways: [
      'Closures store free variables in `__closure__`.',
      'Always use `@functools.wraps(func)` to preserve function name, docstrings, and introspection.',
    ],
    notes: 'Common follow up: Explain how decorators with arguments require three nested functions.',
    is_completed: false,
    priority: 'High',
  },
  {
    category: 'Python',
    title: 'Mutable Default Arguments Pitfall',
    question_or_topic: 'What happens when you define `def append_to(element, target=[])` and call it multiple times? How do you fix it?',
    answer: 'In Python, default arguments are evaluated only once when the function definition is executed (at compile/load time), not each time the function is called. When you provide a mutable object like a list `[]` or dictionary `{}` as a default value, the same object instance is shared across all subsequent invocations. If you mutate it inside the function, those changes persist across calls. The standard Pythonic fix is to use `target=None` as the default argument and initialize a new list inside the function body.',
    code_snippet: `# BUGGY:
def append_bad(item, target=[]):
    target.append(item)
    return target
# append_bad(1) -> [1]
# append_bad(2) -> [1, 2] (Shared reference bug!)

# CORRECT PYTHONIC PATTERN:
def append_good(item, target=None):
    if target is None:
        target = []
    target.append(item)
    return target`,
    key_takeaways: [
      'Default arguments are evaluated once at module load time.',
      'Never use mutable default arguments like `[]` or `{}`.',
      'Use `None` sentinel and initialize inside function.',
    ],
    notes: 'A classic question asked at Amazon and Google fresher interviews.',
    is_completed: false,
    priority: 'Medium',
  },

  // ==================== SQL ====================
  {
    category: 'SQL',
    title: 'Window Functions: DENSE_RANK vs RANK vs ROW_NUMBER',
    question_or_topic: 'Explain the difference between ROW_NUMBER(), RANK(), and DENSE_RANK(). Write a query to find the N-th highest salary in each department.',
    answer: 'All three are SQL window functions that compute ranks over a partitioned window:\n1. `ROW_NUMBER()` assigns a unique consecutive integer (1, 2, 3, 4...) regardless of duplicate values.\n2. `RANK()` assigns identical ranks to ties, but skips subsequent rank numbers (e.g. 1, 2, 2, 4).\n3. `DENSE_RANK()` assigns identical ranks to ties without skipping numbers (e.g. 1, 2, 2, 3).\nFor finding the N-th highest salary per department, `DENSE_RANK()` is preferred because ties in salary must not skip subsequent ranks.',
    code_snippet: `-- Find the 2nd highest salary per department:
WITH RankedSalaries AS (
  SELECT 
    emp_id,
    emp_name,
    dept_id,
    salary,
    DENSE_RANK() OVER (
      PARTITION BY dept_id 
      ORDER BY salary DESC
    ) as salary_rank
  FROM employees
)
SELECT emp_id, emp_name, dept_id, salary
FROM RankedSalaries
WHERE salary_rank = 2;`,
    key_takeaways: [
      'ROW_NUMBER: Never ties, strictly consecutive.',
      'RANK: Ties share rank, skips following ranks (1, 2, 2, 4).',
      'DENSE_RANK: Ties share rank, no skips (1, 2, 2, 3).',
    ],
    notes: 'Interviewers often ask what happens if multiple employees have the exact same highest salary.',
    is_completed: false,
    priority: 'High',
  },
  {
    category: 'SQL',
    title: 'Database Indexing: B-Tree vs Hash & Optimization',
    question_or_topic: 'How do B-Tree indexes work? When will a SQL database ignore an index and perform a Full Table Scan?',
    answer: 'A B-Tree (Balanced Tree) index keeps keys sorted in a multi-level balanced tree structure, allowing O(log N) lookups, range scans (`BETWEEN`, `<`, `>`), and sorted ordering (`ORDER BY`). A Hash index only supports O(1) exact equality (`=`) and cannot handle range queries.\n\nA database query optimizer will ignore an index and perform a Full Table Scan when:\n1. Column is wrapped in a function (e.g. `WHERE UPPER(email) = "FOO"` or `YEAR(created_at) = 2026`). Solution: Functional/Expression index.\n2. Wildcard prefix in LIKE query (e.g. `WHERE name LIKE "%son"`). Leading wildcard prevents binary tree search.\n3. Type mismatch (implicit type conversion between VARCHAR and INT).\n4. Low selectivity (if a query returns 40% of the table rows, sequential scan is faster than random index disk page fetches).',
    code_snippet: `-- Avoid: Ignores normal index on created_at
SELECT * FROM orders WHERE DATE(created_at) = '2026-11-02';

-- Optimized: Uses standard B-Tree index on created_at
SELECT * FROM orders 
WHERE created_at >= '2026-11-02 00:00:00' 
  AND created_at < '2026-11-03 00:00:00';`,
    key_takeaways: [
      'B-Tree supports equality, range scans, and prefix lookups.',
      'Functions on indexed columns bypass B-Tree traversal unless functional index exists.',
      'Leading wildcard (`%text`) forces full table scan.',
    ],
    notes: 'Always mention using `EXPLAIN ANALYZE` to inspect actual query execution plans.',
    is_completed: false,
    priority: 'High',
  },
  {
    category: 'SQL',
    title: 'ACID Properties & 4 Transaction Isolation Levels',
    question_or_topic: 'Define ACID properties and explain what anomalies (Dirty Read, Non-Repeatable Read, Phantom Read) are prevented by the 4 SQL isolation levels.',
    answer: 'ACID guarantees database reliability:\n- Atomicity: All or nothing execution.\n- Consistency: Database moves from one valid state to another obeying all constraints.\n- Isolation: Concurrent transactions do not interfere with each other.\n- Durability: Committed data is permanently saved even during power failure.\n\nThe 4 ANSI SQL isolation levels:\n1. Read Uncommitted: Prevents nothing; allows Dirty Reads (reading uncommitted changes of another tx).\n2. Read Committed: Prevents Dirty Reads. (Default in PostgreSQL).\n3. Repeatable Read: Prevents Dirty Reads and Non-Repeatable Reads (re-reading a row returns same data).\n4. Serializable: Strict serial execution; prevents Phantom Reads (new rows inserted matching range filter).',
    code_snippet: `-- Setting isolation level in PostgreSQL / SQL:
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SELECT balance FROM accounts WHERE user_id = 101;
-- Perform business logic securely without intermediate value changes
COMMIT;`,
    key_takeaways: [
      'Dirty read: Reading uncommitted changes.',
      'Non-repeatable read: Row modified by another tx mid-way.',
      'Phantom read: New rows inserted matching range query.',
    ],
    notes: 'Crucial for backend developer interviews at fintechs and high-scale companies.',
    is_completed: false,
    priority: 'Medium',
  },

  // ==================== DSA ====================
  {
    category: 'DSA',
    title: 'Sliding Window: Longest Substring Without Repeating Characters',
    question_or_topic: 'Given a string `s`, find the length of the longest substring without repeating characters in O(N) time and O(min(N, M)) space.',
    answer: 'Use a dynamic sliding window with two pointers (`left` and `right`) and a hash map (or array of ASCII indices) to store the most recent index of each visited character.\nAs `right` iterates through string:\n1. If character `s[right]` was seen at `last_idx >= left`, move `left = last_idx + 1` to skip the duplicate character.\n2. Update `char_map[s[right]] = right`.\n3. Update `max_len = max(max_len, right - left + 1)`. This guarantees each character is visited at most twice, yielding linear O(N) time complexity.',
    code_snippet: `def length_of_longest_substring(s: str) -> int:
    char_map = {}  # char -> last seen index
    max_len = 0
    left = 0

    for right, ch in enumerate(s):
        if ch in char_map and char_map[ch] >= left:
            left = char_map[ch] + 1
        char_map[ch] = right
        max_len = max(max_len, right - left + 1)

    return max_len

# Example: "abcabcbb" -> 3 ("abc")`,
    key_takeaways: [
      'Sliding window with hash map achieves O(N) time and O(charset) auxiliary space.',
      'Ensure `left` only moves forward: `char_map[ch] >= left`.',
    ],
    notes: 'One of the top 5 most frequently asked LeetCode medium questions across all tech firms.',
    is_completed: false,
    priority: 'High',
  },
  {
    category: 'DSA',
    title: 'Binary Tree Level Order Traversal (BFS)',
    question_or_topic: 'Implement level order traversal of a binary tree returning nodes grouped level by level using a FIFO Queue.',
    answer: 'Use Breadth-First Search (BFS) with a queue (`collections.deque`). At each level, determine the current size of the queue `level_size = len(queue)`. Iterate through `level_size` items to pop nodes from current level, collect their values in a sub-list, and push their non-null left and right children into the queue for the next level. Time Complexity is O(N) since every node is enqueued once. Space Complexity is O(W) where W is the maximum width of the tree (up to N/2 for a full binary tree).',
    code_snippet: `from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def level_order(root: TreeNode) -> list[list[int]]:
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        current_level = []
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(current_level)
        
    return result`,
    key_takeaways: [
      'Queue captures tree width level by level.',
      'Always capture `len(queue)` at start of loop to process current level boundary.',
      'Time: O(N), Space: O(N).',
    ],
    notes: 'Common variations: Zigzag traversal, Right side view of binary tree.',
    is_completed: false,
    priority: 'High',
  },
  {
    category: 'DSA',
    title: '0/1 Knapsack & Dynamic Programming Space Optimization',
    question_or_topic: 'State the recurrence relation for the 0/1 Knapsack problem and optimize the space complexity from O(N * W) to O(W).',
    answer: 'Given item weights `wt[]` and values `val[]` with capacity `W`:\nRecurrence: For item `i` and capacity `w`:\n- If `wt[i-1] <= w`: `dp[w] = max(dp[w], val[i-1] + dp[w - wt[i-1]])`\n- Else: item cannot be included.\n\nIn standard 2D DP, `dp[i][w]` depends only on row `i-1`. Therefore, we can reduce storage to a single 1D array `dp[w]` of size `W + 1`. Crucial rule: We MUST iterate `w` in reverse order from `W` down to `wt[i-1]` so that we reference values from the previous item without accidentally reusing the current item multiple times.',
    code_snippet: `def knapsack_01(values, weights, capacity):
    # 1D array space-optimized DP
    dp = [0] * (capacity + 1)
    
    for v, w in zip(values, weights):
        # Iterate backwards from capacity down to item weight!
        for cap in range(capacity, w - 1, -1):
            dp[cap] = max(dp[cap], v + dp[cap - w])
            
    return dp[capacity]

# Example: values=[60, 100, 120], weights=[10, 20, 30], capacity=50 -> 220`,
    key_takeaways: [
      'Iterating backwards prevents using the same item more than once (0/1 knapsack).',
      'Forward iteration corresponds to Unbounded Knapsack (infinite supply of each item).',
      'Reduces space from O(N*W) to O(W).',
    ],
    notes: 'Fundamental DP problem; opens doors to Coin Change, Subset Sum, and Partition problems.',
    is_completed: false,
    priority: 'High',
  },

  // ==================== MACHINE LEARNING ====================
  {
    category: 'Machine Learning',
    title: 'Bias-Variance Tradeoff & Regularization (L1 vs L2)',
    question_or_topic: 'Explain the bias-variance tradeoff. How do L1 (Lasso) and L2 (Ridge) regularization mathematically prevent overfitting?',
    answer: 'Bias is error from erroneous assumptions in the learning algorithm (underfitting - model is too simple, e.g. linear model on non-linear data). Variance is error from sensitivity to small fluctuations in training data (overfitting - model memorizes noise).\nTotal Error = Bias² + Variance + Irreducible Error.\n\nRegularization adds a penalty to the loss function to constrain model weight complexity:\n- L1 Regularization (Lasso): Adds penalty `λ * Σ|w_i|`. Because the absolute value function has sharp corners at zero, L1 drives non-informative feature weights completely to 0, performing automatic feature selection and producing sparse models.\n- L2 Regularization (Ridge): Adds penalty `λ * Σ(w_i²)`. The quadratic penalty penalizes large weights heavily and shrinks them smoothly toward zero, but never exactly zero, keeping all features.',
    code_snippet: `# Cost Functions:
# Ordinary Least Squares: Loss = MSE(y, y_pred)
# Lasso (L1): Loss = MSE + lambda * sum(|w|)  -> Feature Selection
# Ridge (L2): Loss = MSE + lambda * sum(w^2)  -> Weight Shrinkage
# ElasticNet combines both: Loss = MSE + r*L1 + (1-r)*L2`,
    key_takeaways: [
      'High Bias = Underfitting (add features, increase complexity).',
      'High Variance = Overfitting (add data, regularize, use cross-validation).',
      'L1 leads to sparse coefficients (feature selection); L2 shrinks weights uniformly.',
    ],
    notes: 'Standard ML screening question asked at analytical firms and campus data science rounds.',
    is_completed: false,
    priority: 'Medium',
  },
  {
    category: 'Machine Learning',
    title: 'Precision, Recall, F1 Score & ROC-AUC',
    question_or_topic: 'Why is Accuracy deceptive for imbalanced datasets (e.g. 99% negative fraud detection)? When should you optimize Precision vs Recall?',
    answer: 'If 99% of transactions are legitimate and 1% are fraudulent, a dumb model that predicts "Legitimate" 100% of the time achieves 99% Accuracy while detecting zero fraud. Hence accuracy is useless for imbalanced distributions.\n\n- Precision = TP / (TP + FP): Of all predicted positives, how many are truly positive? Optimize Precision when False Positives are expensive (e.g., spam filter where filtering a real client email is disastrous).\n- Recall = TP / (TP + FN): Of all actual positives, how many did we catch? Optimize Recall when False Negatives are costly/dangerous (e.g., medical cancer diagnosis or financial fraud detection where missing a positive is catastrophic).\n- F1-Score = 2 * (Precision * Recall) / (Precision + Recall): Harmonic mean, penalizing extreme trade-offs.\n- ROC-AUC: Evaluates classifier discrimination capability across all probability thresholds independent of decision boundary.',
    code_snippet: `from sklearn.metrics import classification_report, roc_auc_score

# In imbalanced tasks:
# 1. Use StratifiedKFold to preserve class ratio
# 2. Use class_weight='balanced' in logistic regression / trees
# 3. Use Precision-Recall AUC (PR-AUC) over standard ROC-AUC when positive class is rare`,
    key_takeaways: [
      'Accuracy fails on class imbalance.',
      'High Precision = Few False Alarms.',
      'High Recall = Few Missed Targets.',
      'ROC-AUC measures ranking ability across varying thresholds.',
    ],
    notes: 'Be prepared to draw the 2x2 Confusion Matrix from memory during technical rounds.',
    is_completed: false,
    priority: 'High',
  },

  // ==================== HR QUESTIONS ====================
  {
    category: 'HR Questions',
    title: 'Tell Me About Yourself (The 90-Second Formula)',
    question_or_topic: 'Deliver a compelling, structured 90-second answer to "Tell me about yourself" that hooks the interviewer.',
    answer: 'Follow the Present-Past-Future framework:\n1. The Present (30s): Name, your current educational qualification/degree, and your primary technical focus (e.g., "I am completing my B.Tech in CSE with a focus on scalable backend systems and cloud APIs").\n2. The Past (30s): Highlight 1-2 practical achievements or projects (e.g., "Recently, I built a high-throughput job tracking platform with Next.js and PostgreSQL with strict Row Level Security, and interned at X where I optimized DB queries by 40%").\n3. The Future (30s): Why this company and role (e.g., "I am eager to join your engineering team because of your high-scale distributed architecture, and I am excited to contribute my backend fundamentals from day one").',
    key_takeaways: [
      'Never recite your resume line by line.',
      'Target 90 to 120 seconds maximum.',
      'Always conclude with why you are excited specifically for this company and position.',
    ],
    notes: 'Always practice this out loud until it sounds conversational rather than memorized.',
    is_completed: false,
    priority: 'High',
  },
  {
    category: 'HR Questions',
    title: 'Conflict Resolution & Behavioral (STAR Method)',
    question_or_topic: 'Describe a situation where you had a disagreement with a team member or tight deadline. How did you handle it?',
    answer: 'Use the STAR Framework:\n- Situation: "During our final-year capstone project, our 4-person team had a disagreement regarding whether to use MongoDB or PostgreSQL for our user transaction ledger."\n- Task: "As the backend lead, I needed to ensure we met our database deadline without compromising data integrity or demotivating my teammate who favored MongoDB."\n- Action: "Instead of arguing opinions, I organized a 30-minute benchmarking session. We listed our key requirements: ACID transactions, relational foreign keys, and auditability. I demonstrated with prototype benchmarks how PostgreSQL RLS and relational integrity prevented duplicate transactions."\n- Result: "My teammate appreciated the data-driven clarity. We chose PostgreSQL, completed the backend sprint 2 days ahead of schedule, and scored the highest project rating in our department."',
    key_takeaways: [
      'S: Situation (Context)\n- T: Task (Your specific responsibility)\n- A: Action (Data-driven, respectful problem-solving)\n- R: Result (Quantifiable outcome)',
      'Never blame teammates or speak negatively about professors or employers.',
    ],
    notes: 'Shows emotional intelligence, technical collaboration, and mature communication.',
    is_completed: false,
    priority: 'Medium',
  },
  {
    category: 'HR Questions',
    title: 'What Is Your Greatest Weakness?',
    question_or_topic: 'How to answer "What is your biggest weakness?" honestly without disqualifying yourself.',
    answer: 'Select a real, professional area of growth (not a fake weakness like "I work too hard" or "I am too perfectionist"), and immediately follow up with the concrete, structured system you use to manage it.\n\nSample Model Answer: "Earlier in my college projects, I tended to take on too many tasks simultaneously and hesitated to delegate or ask for help early, which led to last-minute crunch before deadlines. I recognized this pattern and actively implemented time-blocking and daily agile standups with my project partners. Now, whenever I hit an ambiguous obstacle for more than 45 minutes, I document my attempted solutions and proactively consult a senior or peer. This has dramatically improved my team delivery predictability."',
    key_takeaways: [
      'Never use clichéd answers ("perfectionist", "workaholic").',
      'Choose a genuine skill gap and highlight the actionable coping system you built.',
      'Show self-awareness and receptivity to feedback.',
    ],
    notes: 'HR managers look for self-awareness and willingness to learn.',
    is_completed: false,
    priority: 'Medium',
  },

  // ==================== APTITUDE & LOGIC ====================
  {
    category: 'Aptitude',
    title: 'Time, Speed, Distance & Relative Speed of Trains',
    question_or_topic: 'Master the formulas for relative speed: Opposite direction, Same direction, and Trains crossing platforms or poles.',
    answer: 'Key Rules & Conversion:\n1. km/hr to m/s: Multiply by 5/18 (e.g. 72 km/hr = 72 * 5/18 = 20 m/s).\n2. m/s to km/hr: Multiply by 18/5.\n3. Relative Speed:\n   - Moving in Opposite directions: Speeds add up (`S_rel = S1 + S2`).\n   - Moving in Same direction: Speeds subtract (`S_rel = |S1 - S2|`).\n4. Distance covered:\n   - Train of length `L` crossing a pole/man: Distance = `L`.\n   - Train of length `L1` crossing a platform/bridge of length `L2`: Distance = `L1 + L2`.\n   - Two trains crossing each other: Distance = `L1 + L2`. Time = `(L1 + L2) / S_rel`.',
    code_snippet: `# Sample Problem:
# Train A (120m, 60 km/h) and Train B (180m, 48 km/h) travel in opposite directions.
# Time to cross each other:
# S_rel = 60 + 48 = 108 km/h = 108 * (5/18) = 30 m/s
# Total Distance = 120 + 180 = 300 m
# Time = 300 / 30 = 10 seconds!`,
    key_takeaways: [
      'Always convert all units into meters and seconds first.',
      'Crossing a platform requires covering train length + platform length.',
      'Opposite direction: Add speeds; Same direction: Subtract speeds.',
    ],
    notes: 'Guaranteed 2-3 questions in TCS NQT, Infosys, Capgemini, and placement aptitude tests.',
    is_completed: false,
    priority: 'Medium',
  },
  {
    category: 'Aptitude',
    title: 'Work, Pipes, and Cisterns (LCM Method)',
    question_or_topic: 'Solve Work & Time problems in 30 seconds using the LCM Total Work Method instead of fractions.',
    answer: 'Avoid calculating with fractions (1/A + 1/B). Instead use the LCM Method:\n1. Find the LCM of individual days/times taken. Set this LCM as the "Total Work Units".\n2. Divide Total Work by each person\'s days to get their "Efficiency (Units/Day)".\n3. Sum the efficiencies for combined work.\n4. Total Days = (Total Work Units) / (Combined Efficiency).\n\nExample: Person A finishes a job in 12 days, Person B in 15 days, Person C in 20 days.\n- LCM(12, 15, 20) = 60 Units (Total Work).\n- Efficiency A = 60/12 = 5 units/day.\n- Efficiency B = 60/15 = 4 units/day.\n- Efficiency C = 60/20 = 3 units/day.\n- Combined Efficiency = 5 + 4 + 3 = 12 units/day.\n- Time taken together = 60 / 12 = 5 days!',
    key_takeaways: [
      'LCM method eliminates error-prone fractional arithmetic.',
      'Pipes emptying a tank have negative efficiency.',
      'Formula: Days = Total Work / Total Efficiency.',
    ],
    notes: 'The fastest shortcut for campus placement quantitative screening tests.',
    is_completed: false,
    priority: 'Medium',
  },
  {
    category: 'Aptitude',
    title: 'Probability & Combinations ("At Least One" Rule)',
    question_or_topic: 'How to calculate "at least one" probability questions quickly using complementary probability.',
    answer: 'Whenever an aptitude problem asks for the probability of "at least one event occurring" (e.g., "A coin is tossed 4 times, find probability of at least one head", or "At least one defect in 3 samples"):\n\nFormula: P(At least one) = 1 - P(None)\n\nExample: A fair coin is tossed 4 times. Find probability of getting at least one head.\n- Total outcomes = 2^4 = 16.\n- P(No heads) = P(All tails) = (1/2)^4 = 1/16.\n- P(At least one head) = 1 - (1/16) = 15/16 (0.9375).\nCalculating `P(1) + P(2) + P(3) + P(4)` takes 5x longer than `1 - P(0)`.',
    key_takeaways: [
      'P(At least one) = 1 - P(None).',
      'Combinations formula: nCr = n! / (r! * (n - r)!).',
      'Permutations (order matters) vs Combinations (grouping only).',
    ],
    notes: 'Essential shortcut to save time in timed assessments (Accenture, Wipro, Cognizant, etc.).',
    is_completed: false,
    priority: 'Medium',
  },
];

// Helper to access LocalStorage for offline / standalone preview
const isBrowser = typeof window !== 'undefined';

function getLocal<T>(key: string, defaultValue: T): T {
  if (!isBrowser) return defaultValue;
  try {
    const item = localStorage.getItem(`applytrack_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocal<T>(key: string, val: T): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(`applytrack_${key}`, JSON.stringify(val));
  } catch (err) {
    console.error('LocalStorage write error', err);
  }
}

// Data service layer
export class DataService {
  private static async getSupabase() {
    return createClient();
  }

  // --- APPLICATIONS ---
  static async getApplications(userId: string): Promise<Application[]> {
    const supabase = await this.getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', userId)
        .order('application_date', { ascending: false });

      if (error) {
        console.error('Error fetching applications from Supabase:', error);
      } else if (data) {
        return data as Application[];
      }
    }

    // Local fallback
    const all = getLocal<Application[]>('applications', []);
    return all.filter((a) => a.user_id === userId);
  }

  static async createApplication(userId: string, app: Partial<Application>): Promise<Application> {
    const newApp: Application = {
      id: crypto.randomUUID(),
      user_id: userId,
      company_name: app.company_name || 'Untitled Company',
      job_title: app.job_title || 'Software Engineer',
      job_description: app.job_description || '',
      job_url: app.job_url || '',
      location: app.location || 'India',
      work_mode: app.work_mode || 'Hybrid',
      salary_ctc: app.salary_ctc || '',
      application_date: app.application_date || new Date().toISOString().split('T')[0],
      application_deadline: app.application_deadline || '',
      status: app.status || 'Applied',
      recruiter_contact: app.recruiter_contact || '',
      notes: app.notes || '',
      interview_date: app.interview_date || '',
      resume_id: app.resume_id || '',
      resume_name: app.resume_name || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const supabase = await this.getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('applications')
        .insert(newApp)
        .select()
        .single();
      if (!error && data) {
        await this.logActivity(userId, 'Applied to ' + newApp.company_name, 'application', newApp.id);
        return data as Application;
      }
    }

    // Local
    const all = getLocal<Application[]>('applications', []);
    all.unshift(newApp);
    setLocal('applications', all);

    // If application has deadline, auto-create deadline item
    if (newApp.application_deadline) {
      await this.createDeadline(userId, {
        application_id: newApp.id,
        company_name: newApp.company_name,
        job_title: newApp.job_title,
        title: `Deadline: ${newApp.company_name} - ${newApp.job_title}`,
        type: 'deadline',
        due_date: newApp.application_deadline,
        is_completed: false,
      });
    }

    // If interview date exists, create interview item
    if (newApp.interview_date) {
      await this.createDeadline(userId, {
        application_id: newApp.id,
        company_name: newApp.company_name,
        job_title: newApp.job_title,
        title: `Interview: ${newApp.company_name} (${newApp.job_title})`,
        type: 'interview',
        due_date: newApp.interview_date,
        is_completed: false,
      });
    }

    await this.logActivity(userId, `Added application for ${newApp.company_name} - ${newApp.job_title}`, 'application', newApp.id);
    return newApp;
  }

  static async updateApplication(userId: string, id: string, updates: Partial<Application>): Promise<Application | null> {
    const supabase = await this.getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('applications')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();
      if (!error && data) {
        await this.logActivity(userId, `Updated application for ${data.company_name}`, 'application', id);
        return data as Application;
      }
    }

    // Local
    const all = getLocal<Application[]>('applications', []);
    const idx = all.findIndex((a) => a.id === id && a.user_id === userId);
    if (idx !== -1) {
      all[idx] = {
        ...all[idx],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      setLocal('applications', all);
      await this.logActivity(userId, `Updated application for ${all[idx].company_name}`, 'application', id);
      return all[idx];
    }
    return null;
  }

  static async deleteApplication(userId: string, id: string): Promise<boolean> {
    const supabase = await this.getSupabase();
    if (supabase) {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
      if (!error) {
        await this.logActivity(userId, 'Deleted an application', 'application', id);
        return true;
      }
    }

    // Local
    const all = getLocal<Application[]>('applications', []);
    const filtered = all.filter((a) => !(a.id === id && a.user_id === userId));
    setLocal('applications', filtered);
    await this.logActivity(userId, 'Deleted an application', 'application', id);
    return true;
  }

  // --- DEADLINES & INTERVIEWS ---
  static async getDeadlines(userId: string): Promise<DeadlineItem[]> {
    const supabase = await this.getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('deadlines')
        .select('*, applications(company_name, job_title)')
        .eq('user_id', userId)
        .order('due_date', { ascending: true });
      if (!error && data) {
        return data.map((d: any) => ({
          ...d,
          company_name: d.applications?.company_name || d.company_name,
          job_title: d.applications?.job_title || d.job_title,
        }));
      }
    }

    // Local
    const all = getLocal<DeadlineItem[]>('deadlines', []);
    return all
      .filter((d) => d.user_id === userId)
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
  }

  static async createDeadline(userId: string, item: Partial<DeadlineItem>): Promise<DeadlineItem> {
    const newItem: DeadlineItem = {
      id: crypto.randomUUID(),
      user_id: userId,
      application_id: item.application_id,
      company_name: item.company_name,
      job_title: item.job_title,
      title: item.title || 'Scheduled Event',
      type: item.type || 'deadline',
      due_date: item.due_date || new Date().toISOString(),
      is_completed: false,
      notes: item.notes || '',
      created_at: new Date().toISOString(),
    };

    const supabase = await this.getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('deadlines')
        .insert({
          id: newItem.id,
          user_id: userId,
          application_id: newItem.application_id,
          title: newItem.title,
          type: newItem.type,
          due_date: newItem.due_date,
          is_completed: newItem.is_completed,
          notes: newItem.notes,
        })
        .select()
        .single();
      if (!error && data) return data as DeadlineItem;
    }

    const all = getLocal<DeadlineItem[]>('deadlines', []);
    all.push(newItem);
    setLocal('deadlines', all);
    return newItem;
  }

  static async toggleDeadline(userId: string, id: string): Promise<boolean> {
    const supabase = await this.getSupabase();
    if (supabase) {
      const { data } = await supabase.from('deadlines').select('is_completed').eq('id', id).eq('user_id', userId).single();
      if (data) {
        await supabase.from('deadlines').update({ is_completed: !data.is_completed }).eq('id', id).eq('user_id', userId);
        return true;
      }
    }

    const all = getLocal<DeadlineItem[]>('deadlines', []);
    const idx = all.findIndex((d) => d.id === id && d.user_id === userId);
    if (idx !== -1) {
      all[idx].is_completed = !all[idx].is_completed;
      setLocal('deadlines', all);
      return true;
    }
    return false;
  }

  static async deleteDeadline(userId: string, id: string): Promise<boolean> {
    const supabase = await this.getSupabase();
    if (supabase) {
      await supabase.from('deadlines').delete().eq('id', id).eq('user_id', userId);
      return true;
    }

    const all = getLocal<DeadlineItem[]>('deadlines', []);
    setLocal(
      'deadlines',
      all.filter((d) => !(d.id === id && d.user_id === userId))
    );
    return true;
  }

  // --- RESUMES ---
  static async getResumes(userId: string): Promise<Resume[]> {
    const supabase = await this.getSupabase();
    if (supabase) {
      const { data } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (data) return data as Resume[];
    }

    const all = getLocal<Resume[]>('resumes', []);
    return all.filter((r) => r.user_id === userId);
  }

  static async uploadResume(userId: string, file: File, title: string): Promise<Resume> {
    const resumeId = crypto.randomUUID();
    const filePath = `${userId}/${resumeId}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    const supabase = await this.getSupabase();
    if (supabase) {
      // Upload to private Supabase storage bucket 'resumes'
      const { error: uploadErr } = await supabase.storage.from('resumes').upload(filePath, file);
      if (!uploadErr) {
        const { data, error } = await supabase
          .from('resumes')
          .insert({
            id: resumeId,
            user_id: userId,
            title: title || file.name,
            file_path: filePath,
            file_size: file.size,
            file_type: file.type,
          })
          .select()
          .single();
        if (!error && data) {
          await this.logActivity(userId, `Uploaded resume: ${title || file.name}`, 'resume', resumeId);
          return data as Resume;
        }
      }
    }

    // Local simulated storage
    const newResume: Resume = {
      id: resumeId,
      user_id: userId,
      title: title || file.name,
      file_path: filePath,
      file_size: file.size,
      file_type: file.type || 'application/pdf',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const all = getLocal<Resume[]>('resumes', []);
    all.unshift(newResume);
    setLocal('resumes', all);
    await this.logActivity(userId, `Uploaded resume: ${newResume.title}`, 'resume', resumeId);
    return newResume;
  }

  static async renameResume(userId: string, id: string, newTitle: string): Promise<boolean> {
    const supabase = await this.getSupabase();
    if (supabase) {
      const { error } = await supabase.from('resumes').update({ title: newTitle }).eq('id', id).eq('user_id', userId);
      if (!error) return true;
    }

    const all = getLocal<Resume[]>('resumes', []);
    const idx = all.findIndex((r) => r.id === id && r.user_id === userId);
    if (idx !== -1) {
      all[idx].title = newTitle;
      all[idx].updated_at = new Date().toISOString();
      setLocal('resumes', all);
      return true;
    }
    return false;
  }

  static async deleteResume(userId: string, id: string): Promise<boolean> {
    const supabase = await this.getSupabase();
    if (supabase) {
      const { data } = await supabase.from('resumes').select('file_path').eq('id', id).eq('user_id', userId).single();
      if (data?.file_path) {
        await supabase.storage.from('resumes').remove([data.file_path]);
      }
      await supabase.from('resumes').delete().eq('id', id).eq('user_id', userId);
      return true;
    }

    const all = getLocal<Resume[]>('resumes', []);
    setLocal(
      'resumes',
      all.filter((r) => !(r.id === id && r.user_id === userId))
    );
    return true;
  }

  // --- PREPARATION TASKS ---
  static async getPrepTasks(userId: string): Promise<PrepTask[]> {
    const supabase = await this.getSupabase();
    if (supabase) {
      const { data } = await supabase
        .from('preparation_tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      if (data && data.length > 0) return data as PrepTask[];
    }

    // Local fallback
    const all = getLocal<PrepTask[]>('prep_tasks', []);
    const userTasks = all.filter((t) => t.user_id === userId);

    // If new user with no tasks, seed curated questions
    if (userTasks.length === 0) {
      const seeded: PrepTask[] = INITIAL_PREP_TOPICS.map((item) => ({
        ...item,
        id: crypto.randomUUID(),
        user_id: userId,
        created_at: new Date().toISOString(),
      }));
      setLocal('prep_tasks', [...all, ...seeded]);
      return seeded;
    }

    // Enrich existing tasks with updated answers/code snippets and append newly added questions
    const existingTitles = new Set(userTasks.map((t) => t.title.toLowerCase()));
    const enrichedUserTasks = userTasks.map((t) => {
      const match = INITIAL_PREP_TOPICS.find((i) => i.title.toLowerCase() === t.title.toLowerCase());
      if (match) {
        return {
          ...t,
          answer: t.answer || match.answer,
          code_snippet: t.code_snippet || match.code_snippet,
          key_takeaways: t.key_takeaways || match.key_takeaways,
        };
      }
      return t;
    });

    const newToAdd: PrepTask[] = [];
    INITIAL_PREP_TOPICS.forEach((item) => {
      if (!existingTitles.has(item.title.toLowerCase())) {
        newToAdd.push({
          ...item,
          id: crypto.randomUUID(),
          user_id: userId,
          created_at: new Date().toISOString(),
        });
      }
    });

    const finalTasks = [...enrichedUserTasks, ...newToAdd];
    const otherUsersTasks = all.filter((t) => t.user_id !== userId);
    setLocal('prep_tasks', [...otherUsersTasks, ...finalTasks]);

    return finalTasks;
  }

  static async togglePrepTask(userId: string, id: string): Promise<boolean> {
    const supabase = await this.getSupabase();
    if (supabase) {
      const { data } = await supabase.from('preparation_tasks').select('is_completed').eq('id', id).eq('user_id', userId).single();
      if (data) {
        await supabase.from('preparation_tasks').update({ is_completed: !data.is_completed }).eq('id', id).eq('user_id', userId);
        return true;
      }
    }

    const all = getLocal<PrepTask[]>('prep_tasks', []);
    const idx = all.findIndex((t) => t.id === id && t.user_id === userId);
    if (idx !== -1) {
      all[idx].is_completed = !all[idx].is_completed;
      setLocal('prep_tasks', all);
      return true;
    }
    return false;
  }

  static async addPrepTask(userId: string, task: Partial<PrepTask>): Promise<PrepTask> {
    const newTask: PrepTask = {
      id: crypto.randomUUID(),
      user_id: userId,
      category: task.category || 'Python',
      title: task.title || 'Untitled Topic',
      question_or_topic: task.question_or_topic || '',
      notes: task.notes || '',
      is_completed: false,
      priority: task.priority || 'Medium',
      created_at: new Date().toISOString(),
    };

    const supabase = await this.getSupabase();
    if (supabase) {
      const { data } = await supabase.from('preparation_tasks').insert(newTask).select().single();
      if (data) return data as PrepTask;
    }

    const all = getLocal<PrepTask[]>('prep_tasks', []);
    all.push(newTask);
    setLocal('prep_tasks', all);
    return newTask;
  }

  // --- USER PROFILE & ELIGIBILITY ---
  static async getProfile(userId: string, email?: string): Promise<Profile> {
    const supabase = await this.getSupabase();
    if (supabase) {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (data) return data as Profile;
    }

    const all = getLocal<Profile[]>('profiles', []);
    const existing = all.find((p) => p.id === userId);
    if (existing) return existing;

    const defaultProfile: Profile = {
      id: userId,
      email: email || 'student@applytrack.in',
      full_name: 'Student Candidate',
      avatar_url: '',
      college: 'National Institute of Technology / Engineering College',
      degree: 'B.Tech / B.E.',
      branch: 'Computer Science and Engineering',
      graduation_year: 2026,
      cgpa: 8.5,
      skills: ['Python', 'SQL', 'JavaScript', 'React', 'Data Structures', 'Git', 'FastAPI'],
      preferred_roles: ['Software Engineer', 'Full Stack Developer', 'Data Analyst', 'Backend Developer'],
      preferred_locations: ['Bengaluru', 'Hyderabad', 'Pune', 'Gurugram', 'Remote'],
      internship_experience: 'Summer Intern at Tech Labs working on API development and frontend dashboards.',
      subscription_tier: 'free',
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    all.push(defaultProfile);
    setLocal('profiles', all);
    return defaultProfile;
  }

  static async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const supabase = await this.getSupabase();
    if (supabase) {
      const { data } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();
      if (data) return data as Profile;
    }

    const all = getLocal<Profile[]>('profiles', []);
    const idx = all.findIndex((p) => p.id === userId);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...updates, updated_at: new Date().toISOString() };
      setLocal('profiles', all);
      return all[idx];
    }
    const created = { ...(await this.getProfile(userId)), ...updates };
    all.push(created);
    setLocal('profiles', all);
    return created;
  }

  // --- ACTIVITY LOGS ---
  static async logActivity(userId: string, action: string, entity_type: string, entity_id?: string) {
    const log: ActivityLog = {
      id: crypto.randomUUID(),
      user_id: userId,
      action,
      entity_type,
      entity_id,
      created_at: new Date().toISOString(),
    };

    const supabase = await this.getSupabase();
    if (supabase) {
      await supabase.from('activity_logs').insert(log);
      return;
    }

    const all = getLocal<ActivityLog[]>('activity_logs', []);
    all.unshift(log);
    // keep latest 50
    setLocal('activity_logs', all.slice(0, 50));
  }

  static async getActivityLogs(userId: string): Promise<ActivityLog[]> {
    const supabase = await this.getSupabase();
    if (supabase) {
      const { data } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);
      if (data) return data as ActivityLog[];
    }

    const all = getLocal<ActivityLog[]>('activity_logs', []);
    return all.filter((l) => l.user_id === userId).slice(0, 10);
  }

  // --- SUPPORT TICKETS ---
  static async submitSupportTicket(ticket: Omit<SupportTicket, 'id' | 'status' | 'created_at'>): Promise<boolean> {
    const newTicket: SupportTicket = {
      ...ticket,
      id: crypto.randomUUID(),
      status: 'open',
      created_at: new Date().toISOString(),
    };

    const supabase = await this.getSupabase();
    if (supabase) {
      const { error } = await supabase.from('support_tickets').insert(newTicket);
      if (!error) return true;
    }

    const all = getLocal<SupportTicket[]>('support_tickets', []);
    all.unshift(newTicket);
    setLocal('support_tickets', all);
    return true;
  }

  static async getSupportTickets(): Promise<SupportTicket[]> {
    const supabase = await this.getSupabase();
    if (supabase) {
      const { data } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
      if (data) return data as SupportTicket[];
    }
    return getLocal<SupportTicket[]>('support_tickets', []);
  }

  // --- ANNOUNCEMENTS ---
  static async getAnnouncements(): Promise<AdminAnnouncement[]> {
    const supabase = await this.getSupabase();
    if (supabase) {
      const { data } = await supabase.from('admin_announcements').select('*').eq('is_active', true).order('created_at', { ascending: false });
      if (data) return data as AdminAnnouncement[];
    }
    const all = getLocal<AdminAnnouncement[]>('admin_announcements', [
      {
        id: '1',
        title: 'Placement Season 2026 Ready!',
        content: 'ApplyTrack v1.0 is live with complete application tracking, Kanban boards, deadline alerts, and resume organizer.',
        is_active: true,
        created_at: new Date().toISOString(),
      },
    ]);
    return all.filter((a) => a.is_active);
  }
}
