import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  GridItem,
  HStack,
  IconButton,
  Image,
  Input,
  SimpleGrid,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "../config/axiosConfig";
import { isEmail } from "validator";
import { BiHide, BiShowAlt } from "react-icons/bi";
const SignUp = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
    username: "",
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const [paswordShow, setPaswordShow] = useState(false);
  const handlePasswordShow = () => {
    setPaswordShow(!paswordShow);
  };

  const handleInputChange = (e) => {
    setInputValue((preVal) => {
      return {
        ...preVal,
        [e.target.name]: e.target.value,
      };
    });
  };
  const handleSignUp = async () => {
    const { name, email, password, cpassword, username } = inputValue;
    if (!name || !email || !password || !cpassword || !username) {
      return toast({
        title: "Please add all the fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }

    if (!isEmail(email)) {
      return toast({
        title: "Email Invalid {demo@test.com}!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }

    if (!(password === cpassword)) {
      return toast({
        title: "Password does not match!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }

    if (password.length < 6) {
      return toast({
        title: "Password must be 6 characters",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }

    const config = {
      "Content-Type": "application/json",
    };
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/auth/signup`, inputValue, config);
      setLoading(false);
      toast({
        title: data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      navigate("/signin");
    } catch (error) {
      console.log(error);
      setLoading(false);

      return toast({
        title: error.response.data.error,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Wrapper>
      <Container
        maxW='container.xl'
        padding={"20px 0"}
        h='100%'
      >
        <Box
          maxWidth={{ base: "350px", md: "550px" }}
          m='0 auto'
        >
          <Image
            src='./images/ST.png'
            alt='ST'
            width={{ base: "150px" }}
            margin={"10px auto"}
          />
          <Text m='12px 0'>
            Sign up to see photos and videos from your friends
          </Text>
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            spacing={{ base: 2, md: 5 }}
          >
            <GridItem colSpan={1}>
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  onChange={handleInputChange}
                  type={"text"}
                  name='name'
                  id='name'
                  variant={"filled"}
                  placeholder='Full name'
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={1}>
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  onChange={handleInputChange}
                  type={"text"}
                  name='username'
                  id='username'
                  variant={"filled"}
                  placeholder='Username'
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={{ base: 1, md: 2 }}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  onChange={handleInputChange}
                  variant={"filled"}
                  type={"eamil"}
                  name='email'
                  id='email'
                  placeholder='Email'
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={1}>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <HStack>
                  <Input
                    onChange={handleInputChange}
                    type={paswordShow ? "text" : "password"}
                    variant={"filled"}
                    name='password'
                    id='password'
                    placeholder='password'
                  />
                  <IconButton
                    onClick={handlePasswordShow}
                    icon={paswordShow ? <BiShowAlt /> : <BiHide />}
                  />
                </HStack>
              </FormControl>
            </GridItem>
            <GridItem colSpan={1}>
              <FormControl isRequired>
                <FormLabel>Confrim Password</FormLabel>
                <HStack>
                  <Input
                    onChange={handleInputChange}
                    type={paswordShow ? "text" : "password"}
                    variant={"filled"}
                    name='cpassword'
                    id='cpassword'
                    placeholder='Confrim password'
                  />
                  <IconButton
                    onClick={handlePasswordShow}
                    icon={paswordShow ? <BiShowAlt /> : <BiHide />}
                  />
                </HStack>
              </FormControl>
            </GridItem>

            <GridItem colSpan={{ base: 1, md: 2 }}>
              <Text m='12px 0'>
                By signing up, you agree to our Terms, privacy policy and
                cookies policy.
              </Text>
            </GridItem>
            <GridItem colSpan={{ base: 1, md: 2 }}>
              <Button
                w={"full"}
                colorScheme='messenger'
                onClick={handleSignUp}
                isLoading={loading}
              >
                Sign Up
              </Button>
            </GridItem>
            <GridItem
              textAlign={"center"}
              colSpan={{ base: 1, md: 2 }}
            >
              <Text>
                Already have an account ?
                <NavLink to='/signin'>
                  <Text
                    textDecoration={"underline"}
                    color='blue'
                    display='inline'
                    ml='2px'
                  >
                    Sign In
                  </Text>
                </NavLink>
              </Text>
            </GridItem>
          </SimpleGrid>
        </Box>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  background: url("./images/signbg.jpeg") no-repeat center center;
  background-size: cover;
  height: 100vh;
`;
export default SignUp;
