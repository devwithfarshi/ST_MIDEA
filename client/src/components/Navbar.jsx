import styled from "styled-components";
import logo from "../image/ST.png";
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
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { logOutUser } from "../store/slices/userSlice";
import { useState } from "react";
import axios from "../config/axiosConfig";

const Navbar = () => {
  const { user, isLogin } = useSelector((state) => state.user);
  const [searchKey, setSearchKey] = useState("");
  const [searchUser, setSearchUser] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchKey(e.target.value);
    const token = JSON.parse(localStorage.getItem("stMidea")).token;
    axios
      .get(`/api/user/search/${searchKey}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then(({ data }) => {
        setSearchUser(data);
      });
  };

  return (
    <Wrapper>
      <NavLink to={"/"}>
        <img
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
              <Button onClick={onOpen}>Search</Button>
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
                      {searchUser.length > 0
                        ? searchUser.map((u, i) => {
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
                        : null}
                    </VStack>
                  </DrawerBody>
                </DrawerContent>
              </Drawer>
            </li>
            <li>
              <NavLink to='/myfollowingpost'>
                <Button colorScheme={"messenger"}>My Folloing Post</Button>
              </NavLink>
            </li>
            <li>Hello , {user.username}</li>
            <li>
              <Menu>
                <MenuButton>
                  <Avatar
                    name={user.name}
                    src={user.image}
                  />
                </MenuButton>
                <MenuList mt='10px'>
                  <a href={`/profile/${user._id}`}>
                    <MenuItem>Profile</MenuItem>
                  </a>
                  <MenuItem>Mark as Draft</MenuItem>
                  <MenuItem>Setting</MenuItem>
                  <MenuItem>Theme</MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      dispatch(logOutUser());
                      navigate("/signup");
                      localStorage.removeItem("stMidea");
                    }}
                  >
                    LogOut
                  </MenuItem>
                </MenuList>
              </Menu>
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
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.3);
  NavLink {
    img {
      width: 10%;
      object-fit: contain;
    }
  }
`;
const Ul = styled.ul`
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style: none;
  li {
    margin: 0 20px;
    NavLink {
      /* font-family: "Ubuntu", sans-serif; */
      font-family: "Roboto", sans-serif;
    }
  }
`;
export default Navbar;
