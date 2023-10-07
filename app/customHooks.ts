import React, { createContext } from "react";

export const createUpdatableContext = <T>([initialValue, setter]: [
  T,
  React.Dispatch<React.SetStateAction<T>>
]) => createContext({value: initialValue, setter});
