-- SQL Asignment 1
INSERT INTO public.account (
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )
VALUES   (
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n'
  );

-- SQL Assignment 2
UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- SQL Assignment 3
DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';

-- SQL Assignment 4
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM'
  AND inv_model = 'Hummer';

-- SQL Assignment 5
SELECT inv_make, inv_model, classification_name
FROM public.inventory AS i
JOIN public.classification AS c
  ON i.classification_id = c.classification_id
WHERE classification_name = 'Sport';

-- SQL Assignment 6
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/')
WHERE inv_image LIKE '/images/%'
   OR inv_thumbnail LIKE '/images/%';
