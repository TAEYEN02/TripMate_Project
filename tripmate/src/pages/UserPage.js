import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PostContext } from "../context/PostContext";
import {
  UserPageWrapper,
  InfoWrapper,
  Profile,
  ProfileImg,
  UserInfo,
  UserTabs,
  TabContent,
  UserSchedule,
  PostItem,
  UserInfoTab,
  UserReviews,
} from "../components/common/StyledComponents";

export default function User_Page() {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { posts, users, contents, categories, loading } =
    useContext(PostContext);

  const [activeTab, setActiveTab] = useState("schedule");
  const [myInfo, setMyInfo] = useState(false);

  const user_info = users.find((u) => u.user_id === Number(user_id));
  const user_posts = posts.filter((p) => p.writer_id === Number(user_id));

  useEffect(() => {
    if (!loading && authUser)
      setMyInfo(authUser.id === Number(user_id));
  }, [loading, authUser, user_id]);

  const handleNewPost = () => navigate("/create_post");
  const handlePostClick = (id) => navigate(`/post/${id}`);

  if (loading) return <div>Loading...</div>;
  if (!user_info) return <div>사용자를 찾을 수 없습니다.</div>;

  return (
    <>
      <UserPageWrapper>
        <InfoWrapper>
          <Profile>
            <ProfileImg>
              <img src="/img/image.png" alt="프로필" />
            </ProfileImg>
            <UserInfo>
              <div className="info_name">{user_info.name}</div>
              <div className="info_postnum">게시물 {user_posts.length}</div>
              <div className="info_intro">{user_info.intro}</div>
              {myInfo && (
                <button
                  className="setting_bt"
                  onClick={() => navigate("/settings")}
                >
                  <img src="/img/설정.png" alt="설정" />
                </button>
              )}
            </UserInfo>
          </Profile>
        </InfoWrapper>

        <UserTabs>
          {["schedule", "info", "review"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "schedule"
                ? "내 일정"
                : tab === "info"
                ? "내 정보"
                : "내 리뷰"}
            </button>
          ))}
        </UserTabs>

        <TabContent>
          {activeTab === "schedule" && (
            <UserSchedule>
              {myInfo && (
                <button className="new_post_bt" onClick={handleNewPost}>
                  <img src="/img/글쓰기.png" alt="새 글쓰기" />
                </button>
              )}
              {!user_posts.length && <p>일정이 없습니다.</p>}
              {user_posts.map((p) => (
                <PostItem
                  key={p.post_id}
                  onClick={() => handlePostClick(p.post_id)}
                >
                  <p className="post_title">{p.title}</p>
                  <div className="post_images">
                    {contents
                      .filter((c) => c._post_id === p.post_id)
                      .slice(0, 4)
                      .map((c, idx) => (
                        <img key={idx} src={c.img_src} alt="" />
                      ))}
                  </div>
                  <div className="post_categories">
                    {categories
                      .filter((cat) => cat.post_id === p.post_id)
                      .map((cat, idx) => (
                        <span key={idx} className="post_category">
                          #{cat.category_name}
                        </span>
                      ))}
                  </div>
                </PostItem>
              ))}
            </UserSchedule>
          )}

          {activeTab === "info" && (
            <UserInfoTab>
              <p>
                <strong>이름:</strong> {user_info.name}
              </p>
              <p>
                <strong>아이디:</strong>{" "}
                {user_info.username || user_info.user_id}
              </p>
              <p>
                <strong>소개:</strong> {user_info.intro || "소개가 없습니다."}
              </p>
              <p>
                <strong>이메일:</strong>{" "}
                {user_info.email || "등록된 이메일이 없습니다."}
              </p>
            </UserInfoTab>
          )}

          {activeTab === "review" && (
            <UserReviews>
              {!user_posts.length ? (
                <p>작성한 리뷰가 없습니다.</p>
              ) : (
                user_posts.map((p) => (
                  <div key={p.post_id} className="review_item">
                    <p>
                      <strong>{p.title}</strong>
                    </p>
                    {/* 리뷰 내용은 따로 API 필요 */}
                  </div>
                ))
              )}
            </UserReviews>
          )}
        </TabContent>
      </UserPageWrapper>
    </>
  );
}

