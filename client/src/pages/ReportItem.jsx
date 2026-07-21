import React from 'react';
import ItemForm from '../components/ItemForm';
import '../styles/Auth.css';

export default function ReportItem() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Report a lost or found item</h2>
        <p style={{ color: 'var(--color-grey-600)' }}>Provide details and upload images (optional)</p>
        <ItemForm onSuccess={() => alert('Report submitted — it will appear once approved by moderators.')} />
      </div>
    </div>
  );
}
