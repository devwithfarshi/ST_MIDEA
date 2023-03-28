import { Avatar, Image } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import logo from "../image/STUp.png";

const Mobailnav = () => {
  const { user } = useSelector((state) => state.user);
  return (
    <>
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
        <a href={`/profile/${user._id}`}>
          <Avatar
            name={user.name}
            src={user.image}
            size={{ base: "md", md: "lg" }}
          />
        </a>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #fff;
  margin-bottom: 10px;
  height: 72px;
  z-index: 1;
`;

export default Mobailnav;
