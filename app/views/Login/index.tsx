import {
    use,
    useCallback,
    useMemo,
} from 'react';
import {
    Button,
    Container,
    Description,
    Heading,
    Image,
    InlineLayout,
    ListView,
    PageContainer,
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
import { gql } from 'urql';

import UserContext from '#contexts/UserContext';
import { useLoginMutation } from '#generated/types/graphql';
import useAlert from '#hooks/useAlert';
import BackGroundImage from '#resources/image/loginbackground.jpg';
import Logo from '#resources/image/logo.png';

import styles from './styles.module.css';

interface FormFields {
    email?: string;
    password?: string;
}
type FormSchema = ObjectSchema<FormFields>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const defaultFormValue: FormFields = {};

const formSchema: FormSchema = {
    fields: (): FormSchemaFields => ({
        email: {
            required: true,
            requiredValidation: requiredStringCondition,
        },
        password: {
            required: true,
            requiredValidation: requiredStringCondition,
        },
    }),
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LOGIN_MUTATION = gql`
    mutation Login($password: String!, $email: String!) {
        login(password: $password, email: $email) {
            mfaEnabled
            isActive
            fullName
            id
            email
            regionId
            role
            createdAt
        }
    }
`;

function Login() {
    const {
        value: formValue,
        error: formError,
        setFieldValue,
        setError,
        validate,
    } = useForm(formSchema, { value: defaultFormValue });
    const { setUser } = use(UserContext);

    const alert = useAlert();

    const [{ fetching: loginPending }, triggerLogin] = useLoginMutation();

    const fieldError = getErrorObject(formError);

    const login = useCallback(async (val: FormFields) => {
        try {
            const { data, error: apiError } = await triggerLogin({
                email: val.email ?? '',
                password: val.password ?? '',
            });

            if (apiError) {
                alert.show('Incorrect email/password', {
                    variant: 'danger',
                });
                return;
            }

            const loginResponse = data?.login;

            if (!loginResponse) {
                alert.show('Something went wrong. Please try again.', {
                    variant: 'danger',
                });
                return;
            }

            setUser({
                id: loginResponse.id,
                fullName: loginResponse.fullName,
                email: loginResponse.email,
                regionId: loginResponse.regionId,
                role: loginResponse.role,
                mfaEnabled: loginResponse.mfaEnabled,
                isActive: loginResponse.isActive,
                createdAt: loginResponse.createdAt,
            });

            alert.show('Login successful!', { variant: 'success' });
        } catch {
            alert.show('Something went wrong. Please try again.', {
                variant: 'danger',
            });
        }
    }, [triggerLogin, alert, setUser]);

    const handleFormSubmit = useMemo(
        () => createSubmitHandler(
            validate,
            setError,
            login,
        ),
        [validate, setError, login],
    );

    return (
        <PageContainer>
            <ListView
                withSidebar
                layout="grid"
            >
                <Image
                    src={BackGroundImage}
                    className={styles.image}
                />
                <form onSubmit={handleFormSubmit}>
                    <Container
                        pending={loginPending}
                        spacing="lg"
                        withCenteredContent
                        withPadding
                        className={styles.container}
                        pendingMessage="Logging in..."
                    >
                        <InlineLayout
                            contentAlignment="center"
                            contentJustification="center"
                            className={styles.login}
                        >
                            <ListView
                                layout="block"
                                spacing="md"
                            >
                                <ListView>
                                    <Image
                                        withoutBackground
                                        src={Logo}
                                        alt="logo"
                                        className={styles.logo}
                                    />
                                    <ListView
                                        layout="block"
                                        spacing="2xs"
                                    >
                                        <Heading>
                                            ERCS EOC
                                        </Heading>
                                        <Description withLightText textSize="sm">
                                            Login with
                                            your ERCS email and password.
                                        </Description>
                                    </ListView>
                                </ListView>
                                <ListView
                                    layout="block"
                                    spacing="lg"
                                >
                                    <TextInput
                                        name="email"
                                        label="Email/Username"
                                        value={formValue.email}
                                        onChange={setFieldValue}
                                        error={fieldError?.email}
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
                                <span className={styles.separator} />
                                <ListView
                                    layout="block"
                                    withCenteredContents
                                >
                                    <Button
                                        name={undefined}
                                        type="submit"
                                        styleVariant="filled"
                                    >
                                        Login
                                    </Button>
                                </ListView>
                            </ListView>
                        </InlineLayout>
                    </Container>
                </form>
            </ListView>
        </PageContainer>
    );
}

export default Login;
