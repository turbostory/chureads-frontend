import React, { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Nav from "../components/layout/Nav";
import FeedItem from "../components/FeedItem";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import useSSE from "../hooks/useSSE";

const Home = () => {
  // logic
  const history = useNavigate();

  // API 기본 URL 설정
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const currentUser = auth.currentUser;

  const [feedList, setFeedList] = useState([]);

  // sse 연결
  const { isConnected } = useSSE();

  const handleEdit = (data) => {
    history(`/edit/${data._id}`); // edit페이지로 이동
  };

  // DELETE /posts/:id - 특정 게시물 삭제
  const deletePost = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("게시물 삭제 실패:", error);
    }
  };

  const handleDelete = async (selectedItem) => {
    // TODO: 백엔드에 Delete 요청
    const result = await deletePost(selectedItem._id);
    const filterList = feedList.filter((feed) => feed._id !== result.id);
    setFeedList(filterList);
  };

  const handleLike = (selectedId) => {
    console.log("🚀 ~ handleLike ~ selectedId:", selectedId);
  };

  useEffect(() => {
    // 페이지 진입시 딱 한번 실행
    // TODO: 백엔드에 Get 요청

    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/posts`);
        const result = await response.json();
        setFeedList(result);
      } catch (error) {
        console.error(`게시물 조회 실패: ${error}`);
      }
    };

    fetchPosts();
  }, [API_BASE_URL]);

  // view
  return (
    <div className="h-full pt-20 pb-[74px] overflow-hidden">
      {/* START: 헤더 영역 */}
      <Header isLoggedIn={true} />
      {/* END: 헤더 영역 */}
      <main className="h-full overflow-auto">
        {/* TODO */}

        <div>
          {/* START: 피드 영역 */}
          <span className="block p-2 text-right text-sm">
            {isConnected ? "🥇" : "❌"}
          </span>
          <ul>
            {feedList.map((feed) => (
              <FeedItem
                key={feed._id}
                data={feed}
                tags={feed.tags}
                isAuthor={currentUser.uid === feed.userId}
                currentUserId={currentUser.uid}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onLike={handleLike}
              />
            ))}
          </ul>
          {/* END: 피드 영역 */}
        </div>
      </main>
      {/* START: 네비게이션 영역 */}
      <Nav />
      {/* END: 네비게이션 영역 */}
    </div>
  );
};

export default Home;
