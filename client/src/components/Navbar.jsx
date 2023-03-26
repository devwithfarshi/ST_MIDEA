import styled from "styled-components";
import logo from "../image/STUp.png";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  IconButton,
  Icon,
  Image,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { logOutUser } from "../store/slices/userSlice";
import { useState } from "react";
import axios from "../config/axiosConfig";
import {
  AiOutlineHome,
  AiOutlinePlusSquare,
  AiOutlineLogout,
} from "react-icons/ai";
import { SlUserFollowing } from "react-icons/sl";
import { BsSearch } from "react-icons/bs";

const Navbar = () => {
  const { user, isLogin } = useSelector((state) => state.user);
  const [searchKey, setSearchKey] = useState("");
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: modalIsOpen,
    onOpen: modalOnOpen,
    onClose: modalOnClose,
  } = useDisclosure();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setLoading(true);
    setSearchKey(e.target.value);
    if (searchKey) {
      const token = JSON.parse(localStorage.getItem("stmedia")).token;
      axios
        .get(`/api/user/search/${searchKey}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        })
        .then(({ data }) => {
          setLoading(false);
          setSearchUser(data);
        })
        .catch((err) => {
          setLoading(false);
          console.log({ err });
        });
    }
  };

  return (
    <Wrapper>
      <NavLink
        className='nav_logo'
        to={"/"}
      >
        <Image
          src={logo}
          alt='ST'
        />
      </NavLink>
      <Ul>
        {!isLogin ? (
          <>
            <li>
              <NavLink to='/signup'>SignUp</NavLink>
            </li>
            <li>
              <NavLink to='/signin'>SignIn</NavLink>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to='/'>
                {" "}
                <IconButton
                  className='nav_icon'
                  size={"md"}
                  bg='transparent'
                  fontSize={"20px"}
                  _hover={{
                    bg: "transparent",
                  }}
                  icon={<AiOutlineHome />}
                />
              </NavLink>
            </li>
            <li>
              <NavLink to='/myfollowingpost'>
                <Button
                  className='nav_logo'
                  fontSize={{ base: "10px", md: "16px" }}
                  colorScheme={"messenger"}
                  size={{ base: "sm", md: "md" }}
                >
                  Folloing Post
                </Button>
                <IconButton
                  className='nav_icon'
                  size={"lg"}
                  bg='transparent'
                  fontSize={"20px"}
                  _hover={{
                    bg: "transparent",
                  }}
                  icon={<SlUserFollowing />}
                />
              </NavLink>
            </li>
            <li>
              <Text display={{ base: "none", md: "inline" }}>
                Hello , {user.username}
              </Text>
              <NavLink to={"/createpost"}>
                <IconButton
                  className='nav_icon'
                  size={"lg"}
                  bg='transparent'
                  fontSize={"20px"}
                  _hover={{
                    bg: "transparent",
                  }}
                  icon={<AiOutlinePlusSquare />}
                />
              </NavLink>
            </li>
            <li>
              <Button
                className='nav_logo'
                onClick={onOpen}
              >
                Search
              </Button>
              <IconButton
                onClick={onOpen}
                className='nav_icon'
                size={"lg"}
                bg='transparent'
                fontSize={"20px"}
                _hover={{
                  bg: "transparent",
                }}
                icon={<BsSearch />}
              />
              <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
              >
                <DrawerOverlay />
                <DrawerContent>
                  <DrawerCloseButton />
                  <DrawerHeader>Search Your Friends</DrawerHeader>

                  <DrawerBody>
                    <Input
                      placeholder='Search people'
                      onChange={handleSearch}
                    />
                    <Divider />
                    <VStack
                      mt={5}
                      spacing={2}
                    >
                      {searchUser.length > 0 ? (
                        searchUser.map((u, i) => {
                          return (
                            <>
                              <a
                                href={`/profile/${u._id}`}
                                style={{ width: "100%" }}
                              >
                                <HStack
                                  w='full'
                                  key={i}
                                >
                                  <Avatar
                                    src={u.image}
                                    name={u.name}
                                  />
                                  <Text>{u.name}</Text>
                                </HStack>
                              </a>
                            </>
                          );
                        })
                      ) : (
                        <Text my={5}>{loading ? "Searching..." : null}</Text>
                      )}
                    </VStack>
                  </DrawerBody>
                </DrawerContent>
              </Drawer>
            </li>
            <li>
              <Button
                onClick={modalOnOpen}
                colorScheme={"red"}
                className='nav_logo'
              >
                LogOut
              </Button>
              <IconButton
                onClick={modalOnOpen}
                className='nav_icon'
                size={"lg"}
                bg='transparent'
                color={"red"}
                fontSize={"20px"}
                _hover={{
                  bg: "transparent",
                }}
                icon={<AiOutlineLogout />}
              />

              <Modal
                isOpen={modalIsOpen}
                onClose={modalOnClose}
                isCentered
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Log Out Sure?</ModalHeader>
                  <ModalCloseButton />

                  <ModalFooter>
                    <Button
                      colorScheme='blue'
                      mr={3}
                      onClick={modalOnClose}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        dispatch(logOutUser());
                        navigate("/signup");
                        localStorage.removeItem("stmedia");
                      }}
                      variant='ghost'
                      colorScheme={"red"}
                    >
                      Log Out
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </li>
            <li>
              <a href={`/profile/${user._id}`}>
                <Avatar
                  name={user.name}
                  src={user.image}
                  size={{ base: "sm", md: "lg" }}
                />
              </a>
            </li>
          </>
        )}
      </Ul>
    </Wrapper>
  );
};
const Wrapper = styled.nav`
  z-index: 1;
  position: sticky;
  background-color: #fff;
  @media (min-width: 768px) {
    top: 0;
  }
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.3);
  .nav_icon {
    display: none;
  }
  @media (max-width: 768px) {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    height: 72px;
    .nav_logo {
      display: none;
    }
    .nav_icon {
      display: block;
      width: 25px;
      margin: 0 auto;
    }
  }
  NavLink {
    Image {
      min-width: 100px;
      object-fit: contain;
    }
  }
`;
const Ul = styled.ul`
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style: none;
  & > * {
    margin: 0 20px;
  }
  @media (max-width: 768px) {
    width: 100%;
    & > * {
      margin: 0 0px;
    }
  }
  li {
    NavLink {
      font-family: "Roboto", sans-serif;
    }
  }
`;
export default Navbar;
