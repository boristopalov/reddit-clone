import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { FieldHookConfig, useField } from "formik";
import React, { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label?: string;
  size?: (string & {}) | "sm" | "md" | "lg" | "xs";
};

const InputField: React.FC<Props> = (props) => {
  const [field, { error }] = useField(props);
  return (
    // if error is empty cast it to false (double negation)
    // "error" -> true
    // "" -> false
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
      <Input
        {...field}
        {...props}
        id={field.name}
        placeholder={props.placeholder}
      />
      {<FormErrorMessage>{error}</FormErrorMessage> || null}
    </FormControl>
  );
};

export default InputField;
