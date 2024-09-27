INSERT INTO lead_status (id, name, code)
VALUES
  (1,'New', 'new'),
  (2,'Attempted to contact', 'attemptedToContact'),
  (3,'Open', 'open'),
  (4, 'Unqualified','unqualified'),
  (5, 'Waiting', 'waiting');


-- DO NOT NEED THAT: JUST TO KEEP IN MIND HOW TO DO THAT
UPDATE leads
SET statusId = (SELECT id FROM lead_status WHERE name = 'new')
WHERE statusId = 1;