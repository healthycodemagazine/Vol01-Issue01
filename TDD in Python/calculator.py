import unittest


class InfixToPostfixConverter(object):

    operator_precedence = ["*", "/", "-", "+"]


    def _is_operator(self, op):
        return op in self.operator_precedence

    def _has_precedence(self, op1, op2):
        return self.operator_precedence.index(op1) < self.operator_precedence.index(op2)

    def _stack_top(self, operator_stack):
        return operator_stack[-1]

    def _pop_higher_precedence_operators_from_stack(self, stack, op):
        new_stack = stack[::]
        popped_operators = []
        while new_stack and self._has_precedence(self._stack_top(stack), op):
            popped_operators.append(new_stack.pop())

        return (new_stack, popped_operators)

    def convert(self, token_list):
        operator_stack = []
        postfix_list = []
        for token in token_list:
            if self._is_operator(token):
                operator_stack, operators = self._pop_higher_precedence_operators_from_stack(operator_stack, token)
                postfix_list += operators
                operator_stack.append(token)
            else:
                postfix_list.append(token)
                postfix_list += operator_stack[::-1]

        return postfix_list


class InfixToPostfixConverterTest(unittest.TestCase):

    def test_postfix_of_empty_list_is_empty(self):
        converter = InfixToPostfixConverter()
        self.assertEqual([], converter.convert([]))


    def test_postfix_of_single_operation_works(self):
        converter = InfixToPostfixConverter()
        self.assertEqual([2, 2, "+"], converter.convert([2, "+", 2]))

    def test_postfix_of_multiple_operations_work(self):
        converter = InfixToPostfixConverter()
        infix = [2, "+", 3, "-", 4]
        expected = [2, 3, 4, "-", "+"]
        self.assertEqual(expected, converter.convert(infix))

    def test_multiplication_has_higher_precedence_than_addition(self):
        converter = InfixToPostfixConverter()
        infix = [2, "*", 3, "+", 4]
        expected = [2, 3, "*", 4, "+"]
        self.assertEqual(expected, converter.convert(infix))


if __name__ == "__main__":
    unittest.main()

