-- Seed legacy gallery images served from /public/assets/legacy-gallery/
-- Safe to re-run: skips rows that already use legacy/* storage paths.

insert into public.gallery_images (storage_path, url, caption)
select *
from (
  values
    ('legacy/head-teacher-and-pupils.jpg', '/assets/legacy-gallery/head-teacher-and-pupils.jpg', 'Head teacher with pupils on campus.'),
    ('legacy/teachers-classroom.jpg', '/assets/legacy-gallery/teachers-classroom.jpg', 'Teachers with their class.'),
    ('legacy/classroom-01.jpg', '/assets/legacy-gallery/classroom-01.jpg', 'Pupils learning in the classroom.'),
    ('legacy/classroom-02.jpg', '/assets/legacy-gallery/classroom-02.jpg', 'Focused classroom activity.'),
    ('legacy/classroom-03.jpg', '/assets/legacy-gallery/classroom-03.jpg', 'Collaborative learning in class.'),
    ('legacy/classroom-04.jpg', '/assets/legacy-gallery/classroom-04.jpg', 'Pupils engaged in a lesson.'),
    ('legacy/classroom-05.jpg', '/assets/legacy-gallery/classroom-05.jpg', 'Interactive classroom session.'),
    ('legacy/classroom-presentation.jpg', '/assets/legacy-gallery/classroom-presentation.jpg', 'Pupils presenting in front of class.'),
    ('legacy/playground-01.jpg', '/assets/legacy-gallery/playground-01.jpg', 'Children playing outdoors.'),
    ('legacy/playground-02.jpg', '/assets/legacy-gallery/playground-02.jpg', 'Playtime on the school grounds.'),
    ('legacy/playground-03.jpg', '/assets/legacy-gallery/playground-03.jpg', 'Pupils enjoying the playground.'),
    ('legacy/learn-and-play.jpg', '/assets/legacy-gallery/learn-and-play.jpg', 'Learning through play.'),
    ('legacy/fruit-day-01.jpg', '/assets/legacy-gallery/fruit-day-01.jpg', 'Fruit day — healthy eating activity.'),
    ('legacy/fruit-day-02.jpg', '/assets/legacy-gallery/fruit-day-02.jpg', 'Fruit day celebration.'),
    ('legacy/fruit-day-03.jpg', '/assets/legacy-gallery/fruit-day-03.jpg', 'Pupils during fruit day.'),
    ('legacy/campus-01.jpg', '/assets/legacy-gallery/campus-01.jpg', 'KBS campus life.')
) as seed(storage_path, url, caption)
where not exists (
  select 1
  from public.gallery_images existing
  where existing.storage_path = seed.storage_path
     or existing.url = seed.url
);
