import styled from "styled-components";
import { BsFillTrashFill } from "@react-icons/all-files/bs/BsFillTrashFill";
import { FcEditImage } from "@react-icons/all-files/fc/FcEditImage";
import { FaUsers } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MenuLeft from "../components/Menuside";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import avatar from "../assets/user.png";
import dompurify from "dompurify";
import { toast } from "react-toastify";
import ApplauseButton from "../components/ClapCounter";
import Comments from "../components/comments";
import { FaCommentDots } from "react-icons/fa";
import { Offcanvas } from "react-bootstrap";
const Singlepost = () => {
  const [post, setPost] = useState({});
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const navigate = useNavigate();

  const postId = location.pathname.split("/")[2];

  const currentUserUsername = currentUser?.user?.username;

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9000/api/v1/posts/${postId}`
        );
        setPost(res.data.post);
      } catch (err) {
        console.log(err);
      }
    };

    getPost();
  }, [postId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:9000/api/v1/posts/${postId}`, {
        withCredentials: true,
      });
      navigate("/");
      toast.info("Post deleted successfully", {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const createMarkup = (html) => {
    return {
      __html: dompurify.sanitize(html), // this will sanitize the html code to prevent XSS attacks
    };
  };

  return (
    <Wrapper>
      <Post>
        <img className="postImg" src={`../upload/${post.image}`} alt="" />
        <div className="user">
          {post.userImage && (
            <img className="userImg" src={post.userImage} alt="" />
          )}
          <div className="info">
            <PostLink to={`/profile/${post.username}`}>
              {" "}
              <span>{post.fullname}</span>
            </PostLink>

            <p>Posted {moment(post.date).fromNow()}</p>
          </div>
          {currentUserUsername && currentUserUsername === post.username && (
            <div className="Actions">
              <Link to={`/write?edit=${postId}`} state={post}>
                <button title="Edit" className="message">
                  <FcEditImage size={30} />
                </button>
              </Link>
              <Link to={`/singlepost/${postId}`}>
                <button title="Delete" className="message">
                  <BsFillTrashFill
                    onClick={handleDelete}
                    color={"#6A072D"}
                    size={30}
                  />
                </button>
              </Link>
            </div>
          )}
          <Claps>
            <ApplauseButton className="applause" />
          </Claps>
          <button
            onClick={handleShow}
            title=" View Comments"
            className="message"
          >
            {" "}
            <FaCommentDots className="comment" size={30} />
          </button>
        </div>
        <h1>{post.title}</h1>
        <h3>{post.description}</h3>
        <div
          className="paragraph"
          dangerouslySetInnerHTML={createMarkup(post.content)}
          style={{ maxWidth: "100%", overflow: "hidden" }}
        />
        <FooterAction>
          <ApplauseButton />
          <button
            onClick={handleShow}
            title=" View Comments"
            className="message"
          >
            {" "}
            <FaCommentDots className="comment" size={30} />
          </button>
        </FooterAction>
        <Offcanvas show={show} onHide={handleClose} className="w-50">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title className="bg-dark text-light p-3 rounded ">
              User Comments <FaUsers size={30} />
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <ContainerComments>
              {currentUser ? (
                <div className="user-info">
                  <img className="user-Img" src={avatar} alt="avatar" />
                  <h4 className="text-dark ">
                    {currentUser.user.fullname}{" "}
                    <p className="text-danger">What are your thoughts?</p>{" "}
                  </h4>
                </div>
              ) : (
                <h3 className="text-center text-danger pb-3">
                  What are your thoughts?
                </h3>
              )}

              <Comments />
            </ContainerComments>
          </Offcanvas.Body>
        </Offcanvas>
      </Post>
      <MenuSide>
        <MenuLeft category={post.category} />
      </MenuSide>
    </Wrapper>
  );
};

export default Singlepost;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

const Post = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  margin: 0 20px;

  .message {
    border: none;
    background-color: transparent;
    cursor: pointer;
    color: #884dff;
    margin-left: 5px;
    position: relative;
  }

  .message[title]:hover::after {
    content: attr(title);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    padding: 0.5rem;
  }

  .postImg {
    width: 100%;
    border-radius: 5px;
    margin: 30px 0;
  }

  .user {
    display: flex;
    align-items: center;
    margin: -10px 0;

    .userImg {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 10px;
    }
  }

  .info {
    display: flex;
    flex-direction: column;

    span {
      font-weight: bold;
    }

    p {
      font-size: 14px;
      color: #555;
    }
  }

  .Actions {
    padding: 10px;
    display: flex;
    gap: 10px;
  }

  h1 {
    margin: 20px 0;
    font-size: 30px;
  }

  h3 {
    margin: 20px 0;
    font-size: 20px;
    color: #555;
  }

  @media screen and (max-width: 768px) {
    width: 80%;
    margin: 0 auto;
  }

  .comment {
    margin-left: 10px;
    cursor: pointer;
    color: #884dff;
  }

  .comments-end[title]:hover::after {
    content: attr(title);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    padding: 0.5rem;
  }
`;

const PostLink = styled(Link)`
  text-decoration: none;
  color: #333;
  font-weight: bold;
  font-size: 20px;
  cursor: pointer;
`;
const MenuSide = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const Claps = styled.div`
  display: flex;
`;

const ContainerComments = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: 40px 0 0 0px;

  .user-Img {
    width: 75px;
    height: 75px;
    margin-right: 15px;
  }
  .user-info {
    display: flex;
  }
`;

const FooterAction = styled.div`
  display: flex;
  flex-direction: row;
`;
