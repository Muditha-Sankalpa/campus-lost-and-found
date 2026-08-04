import React from 'react';
import ItemForm from '../components/ItemForm';
import '../styles/Auth.css';

export default function ReportItem() {
  return (
    <div className="page-shell">
      <div className="panel">
        <div className="panel__header">
          <div>
            <h2>Report a lost or found item</h2>
            <p>Share the details of what you found or lost. Each report enters moderation first.</p>
          </div>
        </div>
        <ItemForm />
      </div>
    </div>
  );
}
