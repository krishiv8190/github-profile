import { Building2, Link as LinkIcon, MapPin } from "lucide-react";

const ProfileSidebar = ({ profile }) => {
  if (!profile) return null;

  return (
    <aside className="profile-sidebar">
      <img
        className="profile-avatar"
        src={profile.avatar_url}
        alt={`${profile.login}'s avatar`}
      />

      <div className="profile-heading">
        <h1>{profile.name || profile.login}</h1>
        <p>{profile.login}</p>
      </div>

      {profile.bio && <p className="profile-bio">{profile.bio}</p>}

      <a
        className="edit-profile-button"
        href="https://github.com/settings/profile"
      >
        Edit profile
      </a>

      <div className="profile-followers">
        <span>
          <strong>{profile.followers}</strong> followers
        </span>
        <span>·</span>
        <span>
          <strong>{profile.following}</strong> following
        </span>
      </div>

      <div className="profile-details">
        {profile.company && (
          <p>
            <Building2 size={16} />
            <span>{profile.company}</span>
          </p>
        )}

        {profile.location && (
          <p>
            <MapPin size={16} />
            <span>{profile.location}</span>
          </p>
        )}

        {profile.blog && (
          <p>
            <LinkIcon size={16} />
            <a
              href={
                profile.blog.startsWith("http")
                  ? profile.blog
                  : `https://${profile.blog}`
              }
              target="_blank"
              rel="noreferrer"
            >
              {profile.blog}
            </a>
          </p>
        )}
      </div>
    </aside>
  );
};

export default ProfileSidebar;
