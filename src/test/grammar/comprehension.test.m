|| SYNTAX TEST "source.miranda" "comprehensions"

items = [b | b<-xs; b<=a]
||       ^ meta.comprehension.miranda

[b | x<-xs]
||   <^^ keyword.operator.comprehension.generator.miranda

[b | x<-xs; x>0]
|| ~~~~~~~~~~<- keyword.operator.comprehension.filter.miranda

[b | x<-xs | y<-ys]
|| ~~~~~~~~~~~<- keyword.operator.comprehension.separator.miranda
