|| User defined types — Turner overview section 9
|| https://www.cs.kent.ac.uk/people/staff/dat/miranda/Overview.html

tree * ::= Nilt | Node * (tree *) (tree *)

mirror Nilt = Nilt
mirror (Node a x y) = Node a (mirror y) (mirror x)

color ::= Red | Orange | Yellow | Green | Blue | Indigo | Violet

t1 = Node 7 (Node 3 Nilt Nilt) (Node 4 Nilt Nilt)

overview_demo = mirror t1
