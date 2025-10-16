INSERT INTO users (id, email, full_name, timezone)
VALUES
    ('8d6c7c82-0af7-4d31-9b84-7d3e1a53aabc', 'jordan@example.com', 'Jordan Banks', 'America/New_York')
ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (id, user_id, name, type, color, icon)
VALUES
    ('a4ec9bb0-6ddc-4ea0-996c-19e54114df9c', '8d6c7c82-0af7-4d31-9b84-7d3e1a53aabc', 'Groceries', 'expense', '#2F855A', 'shopping_cart'),
    ('d68ce9b6-2e08-4f9c-a7d0-54a8e6600b28', '8d6c7c82-0af7-4d31-9b84-7d3e1a53aabc', 'Salary', 'income', '#3182CE', 'payments')
ON CONFLICT (id) DO NOTHING;

INSERT INTO budgets (id, user_id, name, description, amount, currency, period, start_date, end_date, rollover)
VALUES
    ('63eef8ce-13d9-46bf-8a2d-79a9dee93c2f', '8d6c7c82-0af7-4d31-9b84-7d3e1a53aabc', 'Monthly groceries budget', 'Household grocery spending plan', 600.00, 'USD', 'monthly', '2024-01-01', '2024-01-31', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO budget_categories (budget_id, category_id)
VALUES
    ('63eef8ce-13d9-46bf-8a2d-79a9dee93c2f', 'a4ec9bb0-6ddc-4ea0-996c-19e54114df9c')
ON CONFLICT (budget_id, category_id) DO NOTHING;

INSERT INTO transactions (id, user_id, category_id, budget_id, description, merchant, amount, currency, status, transaction_type, posted_at)
VALUES
    ('af849fdf-6c22-4c67-9ce8-5b7b6a678ea1', '8d6c7c82-0af7-4d31-9b84-7d3e1a53aabc', 'a4ec9bb0-6ddc-4ea0-996c-19e54114df9c', '63eef8ce-13d9-46bf-8a2d-79a9dee93c2f', 'Grocery run - Trader Joe''s', 'Trader Joe''s', 82.43, 'USD', 'posted', 'debit', '2024-01-15T09:30:00Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sync_connections (id, user_id, provider, status, last_synced_at)
VALUES
    ('a1f37a85-8df7-4c26-ae44-0bfe875d189a', '8d6c7c82-0af7-4d31-9b84-7d3e1a53aabc', 'plaid', 'linked', '2024-01-20T01:40:00Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sync_jobs (id, user_id, provider, status, strategy, started_at, finished_at, stats)
VALUES
    ('2f71d119-12ab-4d51-a64b-35b92b8775b4', '8d6c7c82-0af7-4d31-9b84-7d3e1a53aabc', 'plaid', 'succeeded', 'incremental', '2024-01-20T01:35:00Z', '2024-01-20T01:40:00Z', '{"transactionsProcessed": 120, "newTransactions": 24, "updatedTransactions": 7}')
ON CONFLICT (id) DO NOTHING;
