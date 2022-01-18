import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
} from "@chakra-ui/react";
import { useField } from "formik";
import React, { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label?: string;
  size?: (string & {}) | "sm" | "md" | "lg" | "xs";
  textarea?: boolean;
};

const InputField = (props: Props): JSX.Element => {
  const { placeholder, label, textarea } = props;
  const [field, { error }] = useField(props);
  let InputOrTextArea = Input;

  if (textarea) {
    InputOrTextArea = Textarea as any;
  }
  return (
    // if error is empty cast it to false (double negation)
    // "error" -> true
    // "" -> false
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <InputOrTextArea
        {...field}
        {...props}
        id={field.name}
        placeholder={placeholder}
      />
      {<FormErrorMessage>{error}</FormErrorMessage> || null}
    </FormControl>
  );
};

export default InputField;
