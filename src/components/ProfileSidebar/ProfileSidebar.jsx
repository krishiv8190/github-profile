import {
  Building2,
  Link as LinkIcon,
  MapPin,
  Users,
  Mail,
  ExternalLink,
} from "lucide-react";
import "./ProfileSidebar.css";

const ProfileSidebar = ({
  profile,
  organizations = [],
  organizationsLoading = false,
}) => {
  if (!profile) return null;

  const bioLines = (profile.bio || "").split(/\r?\n/).filter(Boolean);

  const website = profile.blog
    ? profile.blog.startsWith("http")
      ? profile.blog
      : `https://${profile.blog}`
    : null;

  const companyName = profile.company?.replace(/^@/, "");

  return (
    <aside className="profile-sidebar">
      <div className="profile-avatar-wrapper">
        <img
          className="profile-avatar"
          src={profile.avatar_url}
          alt={`${profile.login}'s avatar`}
        />
      </div>

      <div className="profile-heading">
        <h1>{profile.name || profile.login}</h1>
        <p>{profile.login}</p>
      </div>

      <a
        className="edit-profile-button"
        href="https://github.com/settings/profile"
      >
        Edit profile
      </a>

      {bioLines.length > 0 && (
        <div className="profile-bio">
          <p>
            {bioLines[0].includes("@UptimeAI") ? (
              <>
                {bioLines[0].split("@UptimeAI")[0]}
                <a
                  className="profile-company-mention"
                  href="https://github.com/UptimeAI"
                  target="_blank"
                  rel="noreferrer"
                >
                  @UptimeAI
                </a>
              </>
            ) : (
              bioLines[0]
            )}
          </p>

          {bioLines.slice(1).map((line, index) => (
            <p key={`${index}-${line}`}>{line}</p>
          ))}
        </div>
      )}

      <div className="profile-followers">
        <Users size={16} aria-hidden="true" />
        <span>
          <strong>{profile.followers ?? 0}</strong> followers
        </span>
        <span aria-hidden="true">·</span>
        <span>
          <strong>{profile.following ?? 0}</strong> following
        </span>
      </div>

      <div className="profile-details">
        {companyName && (
          <p>
            <Building2 size={16} aria-hidden="true" />
            <span>{companyName}</span>
          </p>
        )}

        {profile.location && (
          <p>
            <MapPin size={16} aria-hidden="true" />
            <span>{profile.location}</span>
          </p>
        )}

        {profile.email && (
          <p>
            <Mail size={16} aria-hidden="true" />
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </p>
        )}

        {website && (
          <p>
            <LinkIcon size={16} aria-hidden="true" />
            <a href={website} target="_blank" rel="noreferrer">
              {profile.blog.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            </a>
          </p>
        )}

        {/* {profile.linkedin_username && (
          <p>
            <Linkedin size={16} aria-hidden="true" />
            <a
              href={`https://www.linkedin.com/in/${profile.linkedin_username}`}
              target="_blank"
              rel="noreferrer"
            >
              in/{profile.linkedin_username}
            </a>
          </p>
        )} */}

        {profile.twitter_username && (
          <p>
            <ExternalLink size={16} aria-hidden="true" />
            <a
              href={`https://x.com/${profile.twitter_username}`}
              target="_blank"
              rel="noreferrer"
            >
              @{profile.twitter_username}
            </a>
          </p>
        )}
      </div>

      {!organizationsLoading && organizations.length > 0 && (
        <section className="profile-organizations">
          <h2>Organizations</h2>
          <div className="organization-list">
            {organizations.map((organization) => (
              <a
                className="organization-link"
                href={organization.html_url}
                key={organization.id}
                target="_blank"
                rel="noreferrer"
                aria-label={organization.login}
                title={organization.login}
              >
                <img src={organization.avatar_url} alt="" loading="lazy" />
              </a>
            ))}
          </div>
        </section>
      )}
    </aside>
  );
};

export default ProfileSidebar;
