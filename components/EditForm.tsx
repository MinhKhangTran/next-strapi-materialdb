import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";

import axios from "axios";
import { useRouter } from "next/dist/client/router";
import { API_ENDPOINT } from "config";
import { IMaterial } from "pages/dashboard";

const ComponentForm = ({
  token,
  material,
}: {
  token: string;
  material: IMaterial;
}) => {
  const [formData, setFormData] = useState({
    Name: "",
    Rp: 0,
    Rm: 0,
    bruchdehnung: 0,
    dichte: 0,
    emodul: 0,
    nummer: "",
    querkontraktionszahl: 0,
    schwellfestigkeit: 0,
    wechselfestigkeit: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleDelete = async (id: number) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    if (confirm("Bist du sicher?")) {
      const { data } = await axios.delete(
        `${API_ENDPOINT}/materials/${id}`,
        config
      );
      // console.log(data);
    }
    router.push("/dashboard");
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: formData,
    validationSchema: Yup.object({
      Name: Yup.string().required("Ein Name ist nötig!"),
      Rp: Yup.number()
        .required("Eine Dehngrenze ist nötig")
        .min(1, "Dehngrenze fehlt"),
      Rm: Yup.number()
        .required("Eine Zugfestigkeit ist nötig")
        .min(1, "Zugfestigkeit fehlt"),
      dichte: Yup.number()
        .required("Eine Dichte ist nötig")
        .min(1, "Dichte fehlt"),
      emodul: Yup.number()
        .required("Ein Emodul ist nötig")
        .min(1, "Emodul fehlt"),
      querkontraktionszahl: Yup.number()
        .required("Eine Querkontraktionszahl ist nötig")
        .min(0.1, "Querkontraktionszahl fehlt"),
      bruchdehnung: Yup.number(),
      schwellfestigkeit: Yup.number(),
      wechselfestigkeit: Yup.number(),
      nummer: Yup.string(),
    }),
    onSubmit: async (daten, { resetForm }) => {
      setLoading(true);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.put(
          `${API_ENDPOINT}/materials/${material.id}`,
          {
            Name: daten.Name,
            Rp: Number(daten.Rp),
            Rm: Number(daten.Rm),
            dichte: Number(daten.dichte),
            emodul: Number(daten.emodul),
            querkontraktionszahl: Number(daten.querkontraktionszahl),
            bruchdehnung: Number(daten.bruchdehnung),
            schwellfestigkeit: Number(daten.schwellfestigkeit),
            wechselfestigkeit: Number(daten.wechselfestigkeit),
            nummer: daten.nummer,
          },
          config
        );

        router.push("/dashboard");
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(error.response);
        resetForm();
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    material &&
      setFormData({
        Name: material.Name,
        Rp: material.Rp,
        Rm: material.Rm,
        bruchdehnung: material.bruchdehnung,
        dichte: material.dichte,
        emodul: material.emodul,
        nummer: material.nummer ? material.nummer : "",
        querkontraktionszahl: material.querkontraktionszahl,
        schwellfestigkeit: material.schwellfestigkeit
          ? material.schwellfestigkeit
          : 0,
        wechselfestigkeit: material.wechselfestigkeit
          ? material.wechselfestigkeit
          : 0,
      });
  }, []);
  return (
    <Box mt={8}>
      <form onSubmit={formik.handleSubmit}>
        {/* Name */}
        <FormControl
          isInvalid={!!formik.errors.Name && formik.touched.Name}
          id="Name"
          mt={4}
          isDisabled={loading}
        >
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="Name"
            type="text"
            {...formik.getFieldProps("Name")}
          ></Input>
          <FormErrorMessage>{formik.errors.Name}</FormErrorMessage>
        </FormControl>
        {/* emodul */}
        <FormControl
          isInvalid={!!formik.errors.emodul && formik.touched.emodul}
          id="emodul"
          mt={4}
          isDisabled={loading}
        >
          <FormLabel>Emodul [MPa]</FormLabel>
          <Input
            placeholder="emodul"
            type="number"
            {...formik.getFieldProps("emodul")}
          ></Input>
          <FormErrorMessage>{formik.errors.emodul}</FormErrorMessage>
        </FormControl>
        {/* querkontraktionszahl */}
        <FormControl
          isInvalid={
            !!formik.errors.querkontraktionszahl &&
            formik.touched.querkontraktionszahl
          }
          id="querkontraktionszahl"
          mt={4}
          isDisabled={loading}
        >
          <FormLabel>Querkontraktionszahl [-]</FormLabel>
          <Input
            placeholder="querkontraktionszahl"
            type="number"
            {...formik.getFieldProps("querkontraktionszahl")}
          ></Input>
          <FormErrorMessage>
            {formik.errors.querkontraktionszahl}
          </FormErrorMessage>
        </FormControl>
        {/* Rp */}
        <FormControl
          isInvalid={!!formik.errors.Rp && formik.touched.Rp}
          id="Rp"
          mt={4}
          isDisabled={loading}
        >
          <FormLabel>Rp [MPa]</FormLabel>
          <Input
            placeholder="Rp"
            type="number"
            {...formik.getFieldProps("Rp")}
          ></Input>
          <FormErrorMessage>{formik.errors.Rp}</FormErrorMessage>
        </FormControl>
        {/* Rm */}
        <FormControl
          isInvalid={!!formik.errors.Rm && formik.touched.Rm}
          id="Rm"
          mt={4}
          isDisabled={loading}
        >
          <FormLabel>Rm [MPa]</FormLabel>
          <Input
            placeholder="Rm"
            type="number"
            {...formik.getFieldProps("Rm")}
          ></Input>
          <FormErrorMessage>{formik.errors.Rm}</FormErrorMessage>
        </FormControl>
        {/* dichte */}
        <FormControl
          isInvalid={!!formik.errors.dichte && formik.touched.dichte}
          id="dichte"
          mt={4}
          isDisabled={loading}
        >
          <FormLabel>Dichte [kg/m3]</FormLabel>
          <Input
            placeholder="dichte"
            type="number"
            {...formik.getFieldProps("dichte")}
          ></Input>
          <FormErrorMessage>{formik.errors.dichte}</FormErrorMessage>
        </FormControl>
        {/* ==============================EXTRA============================== */}
        {/* bruchdehnung */}
        <FormControl
          isInvalid={
            !!formik.errors.bruchdehnung && formik.touched.bruchdehnung
          }
          id="bruchdehnung"
          mt={4}
          isDisabled={loading}
        >
          <FormLabel>Bruchdehnung [%]</FormLabel>
          <Input
            placeholder="bruchdehnung"
            type="number"
            {...formik.getFieldProps("bruchdehnung")}
          ></Input>
          <FormErrorMessage>{formik.errors.bruchdehnung}</FormErrorMessage>
        </FormControl>
        {/* schwellfestigkeit */}
        <FormControl
          isInvalid={
            !!formik.errors.schwellfestigkeit &&
            formik.touched.schwellfestigkeit
          }
          id="schwellfestigkeit"
          mt={4}
          isDisabled={loading}
        >
          <FormLabel>schwellfestigkeit [MPa]</FormLabel>
          <Input
            placeholder="Schwellfestigkeit"
            type="number"
            {...formik.getFieldProps("schwellfestigkeit")}
          ></Input>
          <FormErrorMessage>{formik.errors.schwellfestigkeit}</FormErrorMessage>
        </FormControl>
        {/* Wechselfestigkeit */}
        <FormControl
          isInvalid={
            !!formik.errors.wechselfestigkeit &&
            formik.touched.wechselfestigkeit
          }
          id="wechselfestigkeit"
          mt={4}
          isDisabled={loading}
        >
          <FormLabel>Wechselfestigkeit [MPa]</FormLabel>
          <Input
            placeholder="wechselfestigkeit"
            type="number"
            {...formik.getFieldProps("wechselfestigkeit")}
          ></Input>
          <FormErrorMessage>{formik.errors.wechselfestigkeit}</FormErrorMessage>
        </FormControl>
        {/* nummer */}
        <FormControl
          isInvalid={!!formik.errors.nummer && formik.touched.nummer}
          id="nummer"
          mt={4}
          isDisabled={loading}
        >
          <FormLabel>Nummer</FormLabel>
          <Input
            placeholder="Nummer"
            type="text"
            {...formik.getFieldProps("nummer")}
          ></Input>
          <FormErrorMessage>{formik.errors.nummer}</FormErrorMessage>
        </FormControl>
        <ButtonGroup>
          <Button
            isLoading={loading}
            as="button"
            type="submit"
            colorScheme="green"
            mt={4}
            mb={8}
          >
            Ändern
          </Button>
          <Button
            isLoading={loading}
            as="button"
            type="button"
            colorScheme="red"
            mt={4}
            mb={8}
            variant="outline"
            onClick={() => {
              handleDelete(material.id);
            }}
          >
            Löschen
          </Button>
        </ButtonGroup>
      </form>
    </Box>
  );
};

export default ComponentForm;
