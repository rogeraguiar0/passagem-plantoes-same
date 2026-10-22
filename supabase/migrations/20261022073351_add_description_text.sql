alter table public.entries
  add column description_text text
  generated always as (
    btrim(
      replace(replace(replace(replace(
        regexp_replace(
          regexp_replace(description, '</(p|li)>|<br ?/?>', ' ', 'g'),  -- fim de bloco vira espaço
          '<[^>]+>', '', 'g'                                          -- demais tags somem
        ),
        '&lt;', '<'), '&gt;', '>'), '&nbsp;', ' '), '&amp;', '&')
    )
  ) stored;