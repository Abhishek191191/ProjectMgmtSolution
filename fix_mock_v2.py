import sys
import re

filepath = 'src/services/llm.ts'
with open(filepath, 'r') as f:
    content = f.read()

# Pattern to find the wbs block and add startDate to items
def add_start_date(match):
    items_str = match.group(1)
    # Add startDate if not present
    new_items = []
    lines = items_str.split('\n')
    base_dates = [
        '2024-01-01', '2024-01-01', '2024-02-01',
        '2024-01-15', '2024-01-15', '2024-02-15',
        '2024-04-01', '2024-07-01', '2024-08-15'
    ]
    date_idx = 0
    for line in lines:
        if 'task:' in line and 'startDate:' not in line:
            line = line.replace('task:', f'startDate: "{base_dates[date_idx % len(base_dates)]}", task:')
            date_idx += 1
        new_items.append(line)
    return 'wbs: [\n' + '\n'.join(new_items) + '\n      ],'

content = re.sub(r'wbs: \[\s*(.*?)\s*\],', add_start_date, content, flags=re.DOTALL)

with open(filepath, 'w') as f:
    f.write(content)
