import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  FormHelperText,
  Input,
  Textarea,
} from '@chakra-ui/react';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

type InputFieldProps = InputHTMLAttributes<
  HTMLInputElement | HTMLTextAreaElement
> & {
  name: string;
  helperText: string;
  label: string;
  placeholder: string;
  textarea?: boolean;
  explicitWidth?: number;
};

export const InputField: React.FC<InputFieldProps> = ({
  helperText,
  label,
  size: _,
  textarea,
  explicitWidth,
  ...props
}) => {
  const [field, { error }] = useField(props);
  const width = 1000;
  const breakpoint = 700;

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      {textarea ? (
        <Textarea {...field} {...props} id={field.name} />
      ) : (
        <Input
          minW={
            width < breakpoint
              ? '70vw'
              : explicitWidth
              ? explicitWidth
              : '400px'
          }
          {...field}
          {...props}
          id={field.name}
        />
      )}
      <FormHelperText>{helperText}</FormHelperText>
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
