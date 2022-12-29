SELECT * FROM (
        SELECT c.relname AS label, n.oid as namespace_id, c.reltuples AS cnt
        FROM pg_catalog.pg_class c
        JOIN pg_catalog.pg_namespace n
        ON n.oid = c.relnamespace
        WHERE c.relkind = 'r'
        AND n.nspname = '%s'
) as q1
JOIN ag_graph as g ON q1.namespace_id = g.namespace
INNER JOIN ag_label as label

ON label.name = q1.label
AND label.graph = g.oid;
