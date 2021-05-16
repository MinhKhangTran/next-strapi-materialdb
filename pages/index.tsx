import { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Button,
  useToast,
} from "@chakra-ui/react";
import Layout from "@/components/Layout";

import { Router, useRouter } from "next/router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// Formik und yup
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/context/AuthContext";
import { NextApiRequest } from "next";
import { parseCookie } from "@/utils/parseCookie";

const Login = () => {
  const { error, loading, login, user } = useAuth();
  const router = useRouter();

  const [showPW, setShowPW] = useState(false);
  const toast = useToast();
  const formik = useFormik({
    initialValues: { identifier: "", password: "" },
    validationSchema: Yup.object({
      identifier: Yup.string().email().required("Eine Email ist nötig!"),
      password: Yup.string()
        .required("Ein Passwort ist nötig!")
        .min(6, "mindestens 6 Zeichen!"),
    }),
    onSubmit: (daten, { resetForm }) => {
      //@ts-expect-error
      login({ identifier: daten.identifier, password: daten.password });
      // console.log(daten);
      resetForm();
    },
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "ERROR 🥲",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  });
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  });

  return (
    <Layout>
      <Box p={10} mt={16} w={{ base: "100%", md: "45%" }} mx="auto">
        <form onSubmit={formik.handleSubmit}>
          {/* Email */}
          <FormControl
            isInvalid={!!formik.errors.identifier && formik.touched.identifier}
            id="email"
            mt={4}
          >
            <FormLabel color="green.400">E-Mail</FormLabel>
            <Input
              variant="outline"
              type="email"
              placeholder="E-Mail Adresse"
              {...formik.getFieldProps("identifier")}
            />

            <FormErrorMessage>{formik.errors.identifier}</FormErrorMessage>
          </FormControl>

          {/* Password */}
          <FormControl
            isInvalid={!!formik.errors.password && formik.touched.password}
            id="password"
            mt={4}
          >
            <FormLabel color="green.400">Password</FormLabel>
            <InputGroup>
              <Input
                variant="outline"
                type={showPW ? "text" : "password"}
                placeholder="******"
                {...formik.getFieldProps("password")}
              />
              <InputRightElement width="4.5rem">
                <IconButton
                  aria-label="hide/show password"
                  onClick={() => setShowPW(!showPW)}
                  variant="ghost"
                  colorScheme="frontend"
                  h="1.75rem"
                >
                  {showPW ? <FaEyeSlash /> : <FaEye />}
                </IconButton>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
          </FormControl>

          <Button isLoading={loading} mt={8} colorScheme="green" type="submit">
            Login
          </Button>
        </form>
      </Box>
    </Layout>
  );
};

export default Login;
