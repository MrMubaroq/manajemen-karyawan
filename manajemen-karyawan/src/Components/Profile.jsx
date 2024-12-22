import React, { useEffect, useState } from 'react';
import axios from 'axios';


const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    // Fetch profile data from API
    axios.get('http://localhost:3000/auth/profile', { withCredentials: true })
      .then(response => {
        if (response.data.Status) {
          setProfile(response.data.Result);
        } else {
          setError(response.data.Error || 'Error fetching profile data.');
        }
      })
      .catch(() => setError('Failed to fetch profile data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!profile) return <div className="no-data">Profile not available.</div>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <img 
            src={profile.image ? `http://localhost:3000/Images/${profile.image}` : 'https://via.placeholder.com/150'} 
            alt="Profile" 
            className="profile-photo" 
          />
          <h2>{profile.name}</h2>
          <p>{profile.position || 'Position not available'}</p>
        </div>
        <div className="profile-stats">
          <div className="stat">
            <h3>{profile.projects || 0}</h3>
            <p>Projects</p>
          </div>
          <div className="stat">
            <h3>{profile.experience || 'N/A'}</h3>
            <p>Years Experience</p>
          </div>
          <div className="stat">
            <h3>{profile.skills?.length || 0}</h3>
            <p>Skills</p>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="section">
          <h3>About Me</h3>
          <p>{profile.bio || 'No bio available.'}</p>
        </div>

        <div className="section">
          <h3>Work History</h3>
          {profile.workHistory && profile.workHistory.length > 0 ? (
            <ul>
              {profile.workHistory.map((job, index) => (
                <li key={index}>
                  <strong>{job.position}</strong> at {job.company} <br />
                  <span>{job.startDate} - {job.endDate || 'Present'}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No work history available.</p>
          )}
        </div>

        <div className="section">
          <h3>Skills</h3>
          <ul>
            {profile.skills && profile.skills.length > 0 ? (
              profile.skills.map((skill, index) => <li key={index}>{skill}</li>)
            ) : (
              <p>No skills listed.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;



