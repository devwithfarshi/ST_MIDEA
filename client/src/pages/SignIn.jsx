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
import axios from "../config/axiosConfig";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice";
import { BiHide, BiShowAlt } from "react-icons/bi";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const [paswordShow, setPaswordShow] = useState(false);
  const handlePasswordShow = () => {
    setPaswordShow(!paswordShow);
  };

  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleInputChange = (e) => {
    setInputValue((preVal) => {
      return {
        ...preVal,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleSignIn = async () => {
    const { email, password } = inputValue;
    if (!email || !password) {
      return toast({
        title: "Please add all the fields",
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
      const { data } = await axios.post(`/api/auth/signin`, inputValue, {
        headers: config,
      });
      setLoading(false);
      toast({
        title: "Login successfull",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      localStorage.setItem("stmedia", JSON.stringify(data));
      dispatch(setUser(data));
      navigate("/");
    } catch (error) {
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
      >
        <Box
          maxWidth={{ base: "350px", md: "550px" }}
          m='0 auto'
        >
          <Image
            src='./images/ST.png'
            alt='ST'
            width={{ base: "150px" }}
            margin={"20px auto"}
          />
          <SimpleGrid spacing={{ base: 2, md: 5 }}>
            <GridItem>
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
            <GridItem>
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

            <GridItem
              m='20px 0'
              colSpan={{ base: 1, md: 2 }}
            >
              <Button
                w={"full"}
                colorScheme='messenger'
                onClick={handleSignIn}
                isLoading={loading}
              >
                LogIn
              </Button>
            </GridItem>
            <GridItem
              textAlign={"center"}
              colSpan={{ base: 1, md: 2 }}
            >
              <Text>
                Don't have an account ?
                <NavLink to='/signup'>
                  <Text
                    textDecoration={"underline"}
                    color='blue'
                    display='inline'
                    ml='2px'
                  >
                    Sign Up
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
export default SignIn;
