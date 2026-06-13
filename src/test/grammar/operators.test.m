|| SYNTAX TEST "source.miranda" "operators"

sig :: num
||     <^^ keyword.operator.type.signature.miranda

tree ::=
||      <^^^ keyword.operator.type.adt.miranda

alias ==
||       <^^ keyword.operator.type.synonym.miranda

xs ++ ys
||    <^^ keyword.operator.list.miranda

xs -- ys
||    <^^ keyword.operator.list.miranda

[b | x<-xs]
||   <^^ keyword.operator.comprehension.generator.miranda

a \/ b
||  <^^^ keyword.operator.logical.miranda
