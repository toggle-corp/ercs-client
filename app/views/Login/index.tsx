import {
    Button,
    Container,
    ListView,
    PasswordInput,
    TextInput,
} from '@ifrc-go/ui';
import {
    createSubmitHandler,
    getErrorObject,
    type ObjectSchema,
    requiredStringCondition,
    useForm,
} from '@togglecorp/toggle-form';

import Page from '#components/Page';

interface FormFields {
    username?: string;
    password?: string;
}
type FormSchema = ObjectSchema<FormFields>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const defaultFormValue: FormFields = {
};

const formSchema: FormSchema = {
    fields: (): FormSchemaFields => ({
        username: {
            required: true,
            requiredValidation: requiredStringCondition,
        },
        password: {
            required: true,
            requiredValidation: requiredStringCondition,
        },
    }),
};

function Login() {
    const {
        value: formValue,
        error: formError,
        setFieldValue,
        setError,
        validate,
    } = useForm(formSchema, { value: defaultFormValue });

    const fieldError = getErrorObject(formError);

    const login = () => {};

    const handleFormSubmit = () => createSubmitHandler(
        validate,
        setError,
        login,
    );

    return (
        <Page
            heading="Login"
            description="If you are staff, member or volunteer of the Ethiopia Red Cross login with you email and password."
        >
            <form onSubmit={handleFormSubmit}>
                <Container
                    spacing="lg"
                    withCenteredContent
                    withPadding
                >
                    <ListView
                        layout="block"
                        spacing="xl"
                    >
                        <ListView
                            layout="block"
                            spacing="lg"
                        >
                            <TextInput
                                name="username"
                                label="Username"
                                value={formValue.username}
                                onChange={setFieldValue}
                                error={fieldError?.username}
                                withAsterisk
                                autoFocus
                            />
                            <PasswordInput
                                name="password"
                                label="Password"
                                value={formValue.password}
                                onChange={setFieldValue}
                                error={fieldError?.password}
                                withAsterisk
                            />
                        </ListView>
                        <ListView
                            layout="block"
                            withCenteredContents
                        >
                            <Button
                                name={undefined}
                                type="submit"
                            >
                                Login
                            </Button>
                        </ListView>
                    </ListView>
                </Container>
            </form>
        </Page>
    );
}

export default Login;
