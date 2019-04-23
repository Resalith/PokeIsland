import React, { Component } from "react";
import { render } from "react-dom";
import { Formik } from "formik";
import {
    grommet,
    Box,
    Button,
    Grommet,
    FormField,
    Heading,
    Select,
    TextArea,
    TextInput
} from "grommet";

export class AddTeam extends Component {
    state = { submitted: false };

    render() {
        const { submitted } = this.state;
        return (
                <Box align="start">
                    <Box width="medium" margin="large">
                        <Heading>Add a Pokemon</Heading>
                        <Formik
                            validate={values => {
                                const errors = {};
                                if (!values.name) {
                                    errors.name = "required";
                                }
                                if (!values.employeeId) {
                                    errors.employeeId = "required";
                                } else if (!values.employeeId.match(/^[0-9]+$/)) {
                                    errors.employeeId = "numeric only";
                                }
                                return errors;
                            }}
                            validateOnBlur={submitted}
                            validateOnChange={submitted}
                            onSubmit={(values, { setSubmitting }) => {
                                // whatever submitting the form should entail
                                alert("Submitting\n" + JSON.stringify(values, null, 2));
                                setSubmitting();
                            }}
                        >
                            {({
                                  values,
                                  errors,
                                  handleChange,
                                  handleSubmit,
                                  setFieldValue
                              }) => (
                                <form
                                    onSubmit={event => {
                                        event.preventDefault();
                                        this.setState({ submitted: true });
                                        handleSubmit();
                                    }}
                                >
                                    <FormField label="Name" error={errors.name}>
                                        <TextInput
                                            name="name"
                                            value={values.name || ""}
                                            onChange={handleChange}
                                        />
                                    </FormField>
                                    <FormField label="Email" error={errors.email}>
                                        <TextInput
                                            name="email"
                                            type="email"
                                            value={values.email || ""}
                                            onChange={handleChange}
                                        />
                                    </FormField>
                                    <FormField label="Employee ID" error={errors.employeeId}>
                                        <TextInput
                                            name="employeeId"
                                            value={values.employeeId || ""}
                                            onChange={handleChange}
                                        />
                                    </FormField>
                                    <FormField label="Size" error={errors.size}>
                                        <Select
                                            name="size"
                                            options={["small", "medium", "large"]}
                                            value={values.size || ""}
                                            onChange={event => setFieldValue("size", event.value)}
                                        />
                                    </FormField>
                                    <FormField label="Comments" error={errors.comments}>
                    <TextArea
                        name="comments"
                        value={values.comments || ""}
                        onChange={handleChange}
                    />
                                    </FormField>
                                    <Box
                                        tag="footer"
                                        margin={{ top: "medium" }}
                                        direction="row"
                                        justify="between"
                                    >
                                        <Button label="Cancel" color="neutral-1" />
                                        <Button type="submit" primary label="Create" color="neutral-1"/>
                                    </Box>
                                </form>
                            )}
                        </Formik>
                    </Box>
                </Box>
        );
    }

}
