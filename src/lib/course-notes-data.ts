import { CourseNote } from '@/types';

export const COURSE_NOTES_LIBRARY: CourseNote[] = [
  // ==================== 1. PYTHON COURSE NOTES ====================
  {
    id: 'course-python-internals',
    category: 'Python',
    title: 'Python Core & Advanced Internals Master Guide',
    tagline: 'Memory management, GIL, CPython object models, and production concurrency patterns',
    estimated_read_time: '12 min read',
    difficulty: 'Advanced',
    summary: 'A deep-dive textbook guide explaining Python internal execution, reference counting, generational garbage collection, slots optimization, and asynchronous event loops.',
    sections: [
      {
        heading: '1. CPython Memory Model & Garbage Collection',
        content: `Python uses two complementary memory management strategies:
1. Reference Counting: Every object in Python has a header (\`PyObject\`) containing an integer \`ob_refcnt\` and a pointer to its type object (\`ob_type\`). Whenever an object is referenced, its reference count increments; when a reference goes out of scope or is deleted with \`del\`, the count decrements. When \`ob_refcnt == 0\`, the memory is deallocated immediately.
2. Generational Garbage Collector (gc module): Reference counting alone cannot handle reference cycles (e.g. object A points to object B, and object B points back to object A). To resolve this, CPython runs a cyclic garbage collector that tracks objects across three generations (0, 1, and 2). Generation 0 holds newly allocated objects; objects that survive GC cycles are promoted to Generation 1, and eventually Generation 2. Generations are collected based on threshold frequency.`,
        code: `import sys
import gc

# Inspecting reference count:
a = []
print(sys.getsizeof(a))  # Base size in bytes (~56 bytes on 64-bit OS)
print(sys.getrefcount(a))  # Notice: getrefcount passes 'a' as arg, so count is at least 2!

# Disabling or manually running cyclic GC:
gc.collect()  # Forces garbage collection of cyclic references`,
        key_points: [
          'Reference counting offers deterministic deallocation the instant count hits 0.',
          'Cyclic GC detects isolated loops using a doubly-linked list of container objects.',
          'Small Integer Caching: CPython pre-allocates integers from -5 to 256 for instant lookup (a = 256; b = 256 -> a is b is True).',
        ],
      },
      {
        heading: '2. __slots__ Memory Optimization for Large Object Datasets',
        content: `By default, Python instances store attributes in a dynamic dictionary named \`__dict__\`. While flexible, a dictionary introduces significant memory overhead (~150-300 bytes per instance). When instantiating millions of objects (such as nodes in a graph or data records), using \`__slots__\` tells Python to allocate a fixed-size array for attributes instead of a dictionary, reducing memory usage by 60% to 75% and speeding up attribute access.`,
        code: `class StandardStudent:
    def __init__(self, name, cgpa):
        self.name = name
        self.cgpa = cgpa

class OptimizedStudent:
    __slots__ = ('name', 'cgpa')  # No __dict__ created!
    def __init__(self, name, cgpa):
        self.name = name
        self.cgpa = cgpa

# OptimizedStudent uses ~60% less RAM when handling 100k+ instances`,
        key_points: [
          '__slots__ prevents arbitrary dynamic attribute addition.',
          'Eliminates the per-instance __dict__ and __weakref__ overhead.',
          'Ideal for high-throughput batch models and graph algorithms.',
        ],
      },
      {
        heading: '3. Asynchronous I/O with asyncio and Event Loops',
        content: `Asynchronous programming is non-blocking cooperative multitasking. In Python, an event loop manages a queue of coroutines (functions declared with \`async def\`). When a coroutine reaches an \`await\` expression (such as a database query or HTTP call), it yields control back to the event loop, allowing the loop to run other coroutines concurrently while waiting for network I/O.`,
        code: `import asyncio

async def fetch_user_data(user_id):
    print(f"Fetching user {user_id}...")
    await asyncio.sleep(1)  # Simulates non-blocking network I/O
    return {"user_id": user_id, "status": "active"}

async def main():
    # Runs all 3 requests concurrently in ~1.0s instead of sequentially in 3.0s!
    results = await asyncio.gather(
        fetch_user_data(1),
        fetch_user_data(2),
        fetch_user_data(3)
    )
    print("Fetched all:", results)

# asyncio.run(main())`,
        key_points: [
          'asyncio is single-threaded; it does not bypass the GIL for CPU-bound computations.',
          'Extremely efficient for thousands of concurrent idle network connections (WebSockets, microservices).',
          'Never run blocking CPU code inside a coroutine without `asyncio.to_thread()`.',
        ],
      },
    ],
  },

  // ==================== 2. SQL & DATABASE ARCHITECTURE ====================
  {
    id: 'course-sql-rdbms',
    category: 'SQL',
    title: 'Relational Database Architecture & SQL Optimization Handbook',
    tagline: 'Normalization, B+ Tree indexes, Query execution order, Joins, and MVCC',
    estimated_read_time: '15 min read',
    difficulty: 'Advanced',
    summary: 'A definitive guide to relational databases covering 1NF-3NF normalization, internal SQL execution pipeline, composite index indexing rules, and transaction locking.',
    sections: [
      {
        heading: '1. True Order of SQL Query Execution',
        content: `While SQL is written starting with \`SELECT\`, the database engine processes clauses in an entirely different logical pipeline:
1. FROM & JOIN: Determines source tables and evaluates Cartesian products/join predicates.
2. WHERE: Filters individual rows before aggregation. (Cannot use aggregate aliases or window functions here!)
3. GROUP BY: Groups filtered rows by specified column expressions.
4. HAVING: Filters aggregated groups. (Evaluated after GROUP BY).
5. SELECT: Evaluates expressions, column lists, and window functions.
6. DISTINCT: Removes duplicate rows from the projected result.
7. ORDER BY: Sorts the final result set. (Can reference SELECT aliases).
8. LIMIT / OFFSET: Constrains the output pagination window.`,
        code: `-- Example illustrating execution order:
SELECT 
  department_id, 
  COUNT(*) AS total_employees,
  AVG(salary) AS avg_sal
FROM employees
WHERE is_active = TRUE         -- 1. Evaluated first on raw rows
GROUP BY department_id         -- 2. Groups remaining active employees
HAVING COUNT(*) > 5            -- 3. Filters departments with >5 members
ORDER BY avg_sal DESC          -- 4. Sorts output
LIMIT 3;                       -- 5. Restricts top 3`,
        key_points: [
          'WHERE filters rows before grouping; HAVING filters groups after aggregation.',
          'Window functions are computed during the SELECT phase, which is why they cannot be used directly in WHERE without a CTE or subquery.',
        ],
      },
      {
        heading: '2. Database Normalization (1NF, 2NF, 3NF, BCNF) & Denormalization',
        content: `Normalization organizes data to reduce redundancy and prevent insertion, update, and deletion anomalies:
- 1NF (First Normal Form): Every column value must be atomic (no arrays or comma-separated lists), and each record must be uniquely identifiable by a primary key.
- 2NF (Second Normal Form): Must be in 1NF and have NO partial dependencies (all non-key attributes must depend on the whole composite primary key, not just a subset).
- 3NF (Third Normal Form): Must be in 2NF and have NO transitive dependencies (non-key columns cannot depend on other non-key columns).
- BCNF (Boyce-Codd Normal Form): A stricter version of 3NF where for every functional dependency X -> Y, X must be a super key.

When to Denormalize: In high-scale analytical (OLAP) read-heavy environments, strict 3NF causes expensive multi-table joins. Denormalization (pre-joining data, maintaining roll-up totals) is employed intentionally to trade disk space for sub-millisecond query speed.`,
        key_points: [
          '1NF = Atomic values.',
          '2NF = No partial key dependency.',
          '3NF = No non-key transitive dependency.',
          'OLTP systems prefer 3NF to avoid update anomalies; OLAP warehouses prefer star/snowflake denormalization.',
        ],
      },
      {
        heading: '3. Composite Indexes & Leftmost Prefix Rule',
        content: `A composite index is an index on multiple columns, e.g. \`CREATE INDEX idx_emp ON employees (dept_id, status, salary)\`.
The Leftmost Prefix Rule dictates that the query optimizer can only use the index if the query constraints include the leftmost column of the index in order.
- \`WHERE dept_id = 5\` -> Uses Index!
- \`WHERE dept_id = 5 AND status = 'Active'\` -> Uses Index!
- \`WHERE dept_id = 5 AND salary > 50000\` -> Uses Index on dept_id only.
- \`WHERE status = 'Active'\` -> CANNOT use index! (Skips the leftmost prefix column \`dept_id\`).`,
        code: `-- Optimal multi-column index creation:
CREATE INDEX idx_users_search ON users (country, role, created_at);

-- FAST: Matches leftmost prefix (country)
SELECT * FROM users WHERE country = 'IN' AND role = 'Engineer';

-- SLOW (Full Table Scan): Skips leftmost column (country)
SELECT * FROM users WHERE role = 'Engineer';`,
        key_points: [
          'Place high-cardinality equality columns first in composite indexes.',
          'Range conditions (<, >, BETWEEN) stop multi-column index usage for subsequent columns in the key.',
        ],
      },
    ],
  },

  // ==================== 3. DATA STRUCTURES & ALGORITHMS ====================
  {
    id: 'course-dsa-handbook',
    category: 'DSA',
    title: 'Data Structures & Algorithms Placement Playbook',
    tagline: 'Complexity benchmarks, recurring interview patterns, Graph traversals, and DP frameworks',
    estimated_read_time: '18 min read',
    difficulty: 'Intermediate',
    summary: 'A master review sheet covering Big-O time and space complexity, two-pointers, sliding window, cyclic linked lists, monotonic stacks, tree traversals, and dynamic programming patterns.',
    sections: [
      {
        heading: '1. Time & Space Complexity Master Reference',
        content: `Every candidate must memorize the standard runtime upper bounds:
- O(1) Constant: Hash table lookup/insertion (average), array indexing, stack push/pop.
- O(log N) Logarithmic: Binary search, balanced BST search/insert, heap insert/extract-min.
- O(N) Linear: Array traversal, two-pointer sliding window, tree DFS/BFS traversal, counting sort.
- O(N log N) Linearithmic: Merge Sort, Quick Sort (average), Heap Sort, TimSort (Python sorted()).
- O(N^2) Quadratic: Nested loops, Bubble/Insertion Sort, pairwise combinations.
- O(2^N) Exponential: Generating all subsets/power set, recursive Fibonacci without memoization.
- O(N!) Factorial: Generating all permutations of an array (Traveling Salesperson via brute force).`,
        key_points: [
          'If N <= 10^4: O(N^2) algorithms will pass within standard 1.0 second limit (~10^8 operations).',
          'If N <= 10^6: You MUST aim for O(N log N) or O(N).',
          'If N <= 10^9: You MUST aim for O(log N) or O(1).',
        ],
      },
      {
        heading: '2. Floyd\'s Cycle Detection (Tortoise and Hare Algorithm)',
        content: `Detecting a cycle in a linked list and finding the cycle entry point in O(N) time and O(1) space.
Algorithm:
1. Initialize two pointers: \`slow\` moves 1 step, \`fast\` moves 2 steps.
2. If \`fast\` reaches NULL, there is no cycle.
3. If \`slow == fast\`, a cycle exists.
4. Entry Point Finding: Reset \`slow\` to \`head\`, keep \`fast\` at the meeting point. Move both pointers 1 step at a time. The point where they meet is the exact node where the cycle begins! (Derived mathematically: distance from head to entry equals distance from meeting point to entry).`,
        code: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def detect_cycle_entry(head: ListNode) -> ListNode | None:
    slow = fast = head
    has_cycle = False
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            has_cycle = True
            break
            
    if not has_cycle:
        return None
        
    # Reset slow to head; advance both 1 step
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
        
    return slow  # Exact cycle start node`,
        key_points: [
          'O(N) time, O(1) auxiliary space (no hash set of visited addresses needed).',
          'Also applied in finding duplicate numbers in an array (LeetCode 287).',
        ],
      },
      {
        heading: '3. The 5 Core Dynamic Programming Archetypes',
        content: `90% of DP interview problems fall into 5 reproducible categories:
1. 1D Linear State: \`dp[i]\` represents optimal answer up to index \`i\` (Climbing Stairs, House Robber, Decode Ways).
2. Two Sequences / String Match: \`dp[i][j]\` represents answer matching \`s1[0..i]\` with \`s2[0..j]\` (Longest Common Subsequence, Edit Distance).
3. Knapsack / Subset Sum: \`dp[w]\` represents target capacity or sum (0/1 Knapsack, Coin Change).
4. Longest Increasing Subsequence (LIS): Can be solved in O(N^2) with DP or O(N log N) with patience sorting & binary search (\`bisect_left\`).
5. Interval DP: \`dp[i][j]\` represents merging or partitioning subarray from \`i\` to \`j\` (Matrix Chain Multiplication, Burst Balloons).`,
        key_points: [
          'Always identify the base cases first.',
          'Determine state parameters (minimize state variables to reduce memory).',
          'Check if rolling array / variables can optimize 2D space down to 1D.',
        ],
      },
    ],
  },

  // ==================== 4. SYSTEM DESIGN FUNDAMENTALS ====================
  {
    id: 'course-system-design',
    category: 'System Design',
    title: 'High-Level System Design & Architecture Foundations',
    tagline: 'Horizontal scaling, caching patterns, CAP theorem, and database partitioning',
    estimated_read_time: '14 min read',
    difficulty: 'Intermediate',
    summary: 'A comprehensive crash course for fresher and junior engineering system design interviews covering load balancers, CDN caching, database sharding, and message brokers.',
    sections: [
      {
        heading: '1. The CAP Theorem & PACELC Theorem',
        content: `In any distributed data store, you can only guarantee 2 of the following 3 properties (CAP Theorem):
- Consistency (C): Every read receives the most recent write or an error.
- Availability (A): Every non-failing node returns a response (without guarantee that it contains the most recent write).
- Partition Tolerance (P): The system continues to operate despite an arbitrary number of messages dropped or delayed by the network between nodes.

Because network hardware partitions are inevitable in real-world distributed infrastructure, all distributed systems MUST tolerate partitions (P). Hence the practical choice is between:
- CP Systems (e.g. HBase, Spanner, Redis Sentinel): Sacrifice availability under partition to ensure absolute data accuracy.
- AP Systems (e.g. Cassandra, DynamoDB): Sacrifice strong consistency; return possibly stale data but remain available, using eventual consistency.

PACELC Extension: If there is a Partition (P), how does your system trade Availability (A) vs Consistency (C)? Else (E), how does it trade Latency (L) vs Consistency (C)?`,
        key_points: [
          'Network partitions cannot be avoided; real systems choose CP or AP.',
          'Financial systems prefer CP (consistency over uptime).',
          'Social media feeds prefer AP (availability & latency over instant consistency).',
        ],
      },
      {
        heading: '2. Caching Strategies: Cache-Aside vs Write-Through vs Write-Behind',
        content: `Caching places high-frequency data in fast in-memory stores (e.g., Redis, Memcached) to reduce database load:
- Cache-Aside (Lazy Loading): The application first checks the cache. If cache hit, returns data. If cache miss, reads from database, updates the cache, and returns data. (Pros: Only requested data is cached. Cons: Cache miss introduces 3 round trips).
- Write-Through: The application writes to the cache and the cache immediately writes synchronously to the database. (Pros: Cache is always up-to-date. Cons: Write latency is higher).
- Write-Behind (Write-Back): The application writes only to the cache. The cache asynchronously batches writes to the database in background. (Pros: Lightning-fast write latency. Cons: Risk of data loss if cache node crashes before flushing to DB).`,
        key_points: [
          'Cache Invalidation is one of the two hardest problems in computer science.',
          'Always configure a Time-To-Live (TTL) on cache keys to prevent memory leaks.',
          'Use Cache-Aside for read-heavy workloads; use Write-Through for high data consistency.',
        ],
      },
      {
        heading: '3. Database Sharding & Consistent Hashing',
        content: `When a single database server cannot handle the storage volume or write throughput, data is sharded across multiple machines:
- Horizontal Partitioning (Sharding): Splitting rows across different database nodes based on a Shard Key (e.g. \`user_id % num_shards\`).
- Consistent Hashing: Standard modulo hashing (\`key % N\`) breaks when nodes are added or removed, requiring almost 100% of keys to be re-shuffled. Consistent hashing maps both keys and servers to positions on a 360° circular hash ring. When a server node is added or removed, only $1/N$ of keys need migration on average!`,
        key_points: [
          'Pick high-cardinality, evenly distributed shard keys (e.g., UUID or user_id).',
          'Virtual nodes on the hash ring balance uneven load distribution (hotspots).',
        ],
      },
    ],
  },

  // ==================== 5. MACHINE LEARNING & AI ====================
  {
    id: 'course-ml-foundations',
    category: 'Machine Learning',
    title: 'Machine Learning & Applied AI Fundamentals',
    tagline: 'Gradient descent, decision tree ensembles, neural network backprop, and feature engineering',
    estimated_read_time: '12 min read',
    difficulty: 'Intermediate',
    summary: 'A foundational summary of supervised learning, regularization, loss functions, random forests, gradient boosting, and deep learning architectures.',
    sections: [
      {
        heading: '1. Gradient Descent Optimization Variants',
        content: `Gradient Descent minimizes the model loss function by iteratively updating weights in the opposite direction of the gradient: \`w = w - alpha * grad(Loss)\`.
1. Batch Gradient Descent: Computes loss gradient over the entire dataset before making one parameter update. (Pros: Stable convergence. Cons: Extremely slow and memory-intensive for large datasets).
2. Stochastic Gradient Descent (SGD): Updates parameters for every single training sample. (Pros: Very fast, escapes shallow local minima. Cons: High variance in loss curve; fluctuates erratically).
3. Mini-Batch Gradient Descent: The industry standard. Computes gradients over small batches (e.g., 32, 64, 128 samples). Combines the convergence stability of batch GD with the speed of vectorization on GPUs.
4. Adam (Adaptive Moment Estimation): Computes adaptive learning rates for each parameter by storing exponentially decaying averages of past gradients (first moment / momentum) and past squared gradients (second moment / RMSProp).`,
        key_points: [
          'Mini-batch size is typically a power of 2 for GPU cache alignment.',
          'Learning rate decay / warm-up schedules prevent divergence in modern deep learning.',
          'Adam is the default recommended optimizer for non-convex neural networks.',
        ],
      },
      {
        heading: '2. Ensemble Methods: Bagging vs Boosting',
        content: `Ensemble methods combine predictions from multiple base models (weak learners) to create a stronger predictor:
- Bagging (Bootstrap Aggregating, e.g. Random Forest): Trains multiple independent trees in parallel on random bootstrap samples of the training set (with replacement) and subsets of features. Predictions are averaged (regression) or voted (classification). Goal: Dramatically reduces Variance (overfitting).
- Boosting (e.g. Gradient Boosting, XGBoost, LightGBM, CatBoost): Trains trees sequentially. Each new tree is trained to predict the residual errors (gradients) of the combined preceding trees. Goal: Dramatically reduces Bias (underfitting).`,
        key_points: [
          'Random Forest = Parallel trees, reduces variance.',
          'Gradient Boosting = Sequential error correction, reduces bias.',
          'XGBoost adds L1/L2 tree complexity regularization and exact histogram binning.',
        ],
      },
    ],
  },

  // ==================== 6. QUANTITATIVE APTITUDE ====================
  {
    id: 'course-aptitude-math',
    category: 'Aptitude',
    title: 'Quantitative Aptitude & Speed Math Master Formulas',
    tagline: 'Vedic math shortcuts, percentage tricks, LCM methods, and probability cheat sheets',
    estimated_read_time: '10 min read',
    difficulty: 'Beginner',
    summary: 'Essential formulas, calculation shortcuts, and mental math strategies to crack on-campus aptitude rounds (TCS NQT, Infosys, Wipro, Cognizant, Accenture, Capgemini).',
    sections: [
      {
        heading: '1. Percentage & Successive Discount Speed Formulas',
        content: `When a quantity changes by A% and then by B%:
Net Percentage Change Formula = A + B + (A * B / 100)%
- If increased: use positive value (+A).
- If decreased/discounted: use negative value (-A).

Example: A shop offers successive discounts of 20% and 10%.
Net discount = (-20) + (-10) + [(-20 * -10) / 100] = -30 + 2 = -28% (Single equivalent discount is 28%, NOT 30%!).

Inverse Percentage Rule:
If A is x% more than B, then B is [x / (100 + x)] * 100% less than A.
- 25% increase is offset by a 20% decrease!
- 50% increase is offset by a 33.33% decrease!`,
        key_points: [
          'Master fractional conversions: 1/6 = 16.66%, 1/7 = 14.28%, 1/8 = 12.5%, 1/9 = 11.11%, 1/11 = 9.09%, 1/12 = 8.33%.',
          'Successive discounts always yield less than their arithmetic sum.',
        ],
      },
      {
        heading: '2. Clocks & Angles Shortcut Formulas',
        content: `Standard angle formula between hour hand and minute hand at H hours and M minutes:
Angle (theta) = |30 * H - (11/2) * M|

Example: Find angle between hands at 3:40:
theta = |30 * 3 - (11/2) * 40| = |90 - 220| = |-130| = 130 degrees!
If the computed angle is greater than 180°, subtract from 360° to find the smaller angle.`,
        key_points: [
          'Speed of minute hand: 6 degrees per minute.',
          'Speed of hour hand: 0.5 degrees per minute.',
          'Relative speed between hands: 5.5 degrees (11/2°) per minute.',
          'Hands coincide (0°) 22 times in 24 hours (not 24 times due to 11-12-1 loop).',
        ],
      },
    ],
  },

  // ==================== 7. BEHAVIORAL & HR MASTERY ====================
  {
    id: 'course-hr-behavioral',
    category: 'HR & Soft Skills',
    title: 'HR Behavioral Interview Mastery & Placement Psychology',
    tagline: 'STAR formula scripts, executive presence, salary discussion protocols, and closing questions',
    estimated_read_time: '11 min read',
    difficulty: 'Beginner',
    summary: 'A tactical handbook on delivering high-impact STAR answers, handling salary expectations for freshers, demonstrating culture fit, and leaving lasting positive impressions on recruiters.',
    sections: [
      {
        heading: '1. The 5 Questions You Must Ask The Interviewer',
        content: `When the interviewer asks "Do you have any questions for us?", never say "No, I think you covered everything." Asking strategic questions demonstrates high intellectual curiosity and serious interest:
1. Engineering Culture: "What does the typical feedback and code review cycle look like for engineers on this team?"
2. Growth & Impact: "What is an example of a meaningful project a fresher or intern took ownership of in their first 6 months?"
3. Architecture: "What is the biggest technical or scalability challenge your engineering team is tackling this quarter?"
4. Tech Stack Evolution: "I noticed your team uses microservices with Go and Next.js—what led to that architectural choice?"
5. Success Metrics: "What distinguishes a good engineer from a truly exceptional engineer in this role?"`,
        key_points: [
          'Never ask about leaves, vacation policies, or salary in the initial technical round.',
          'Frame questions around how you can contribute to the team\'s current goals.',
          'Listen actively to their response and link it to your own technical enthusiasm.',
        ],
      },
      {
        heading: '2. Handling Salary Expectations For Freshers & Placement Candidates',
        content: `For campus placements and fresher hiring, companies usually have fixed salary bands (CTC / LPA). However, if asked in an off-campus or general interview:
"What are your salary expectations?"
Optimal Strategy:
1. Defer respectfully: "Right now, my primary priority is finding the right technical team where I can apply my skills in distributed systems and grow as a software engineer. I know [Company Name] offers fair, competitive market compensation for engineering graduates, and I am confident we can agree on a package aligned with company standards once we verify mutual fit."
2. If pressed for a number: Research Glassdoor / AmbitionBox ranges beforehand and give a narrow range based on market data: "Based on my research for SDE-1 roles in Bengaluru requiring this tech stack, the typical band is between ₹8 to 11 LPA. I would be very comfortable within that bracket."`,
        key_points: [
          'Never lowball yourself out of fear.',
          'Base all statements on market data and role responsibilities.',
          'Maintain enthusiasm and professionalism throughout the discussion.',
        ],
      },
    ],
  },
];
