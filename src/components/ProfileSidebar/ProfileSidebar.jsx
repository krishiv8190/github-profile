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
    ? /^https?:\/\//i.test(profile.blog)
      ? profile.blog
      : `https://${profile.blog}`
    : null;

  const companyName = profile.company?.replace(/^@/, "");

  const renderBioLine = (line, index) => {
    const companyMention = "@UptimeAI";
    const mentionIndex = line.indexOf(companyMention);

    if (mentionIndex === -1) {
      return <p key={`${index}-${line}`}>{line}</p>;
    }

    return (
      <p key={`${index}-${line}`}>
        {line.slice(0, mentionIndex)}
        <a
          className="profile-company-mention"
          href="https://github.com/UptimeAI"
          target="_blank"
          rel="noreferrer"
        >
          {companyMention}
        </a>
        {line.slice(mentionIndex + companyMention.length)}
      </p>
    );
  };

  return (
    <aside className="profile-sidebar">
      <div className="profile-avatar-wrapper">
        <img
          className="profile-avatar"
          src={profile.avatar_url}
          alt={`${profile.login}'s avatar`}
        />

        <span
          className="avatar-status"
          role="img"
          aria-label="Status: Focusing"
          title="Focusing"
        >
          <span className="avatar-status-emoji" aria-hidden="true">
            🎯
          </span>
          <span className="avatar-status-text">Focusing</span>
        </span>
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
        <div className="profile-bio">{bioLines.map(renderBioLine)}</div>
      )}

      <div className="profile-followers">
        <Users size={16} aria-hidden="true" />

        <a href={`https://github.com/${profile.login}?tab=followers`}>
          <strong>{profile.followers ?? 0}</strong> followers
        </a>

        <span className="followers-separator" aria-hidden="true">
          ·
        </span>

        <a href={`https://github.com/${profile.login}?tab=following`}>
          <strong>{profile.following ?? 0}</strong> following
        </a>
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
              {profile.blog.replace(/^https?:\/\//i, "").replace(/\/$/, "")}
            </a>
          </p>
        )}

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
