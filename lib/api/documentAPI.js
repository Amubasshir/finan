// API service for document management

// Get all documents for the current user
export async function getDocuments(loanApplicationId, category) {
  try {
    let url = '/api/documents';
    const params = new URLSearchParams();
    
    if (loanApplicationId) {
      params.append('loanApplicationId', loanApplicationId);
    }
    
    if (category) {
      params.append('category', category);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch documents');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
}

// Get a specific document by ID
export async function getDocumentById(id) {
  try {
    const response = await fetch(`/api/documents/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch document');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching document:', error);
    throw error;
  }
}

// Create a new document
export async function createDocument(documentData) {
  try {
    const response = await fetch('/api/documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(documentData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create document');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
}

// Update a document
export async function updateDocument(id, updateData) {
  try {
    const response = await fetch(`/api/documents/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updateData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update document');
    }
    
    return data;
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
}

// Delete a document
export async function deleteDocument(id) {
  try {
    const response = await fetch(`/api/documents/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete document');
    }
    
    return data;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
}

// Upload a file to a document
export async function uploadFile(id, file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`/api/documents/${id}/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to upload file');
    }
    
    return data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// Verify a document (admin/manager only)
export async function verifyDocument(id, status, rejectionReason) {
  try {
    const response = await fetch(`/api/documents/${id}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        status,
        rejectionReason
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to verify document');
    }
    
    return data;
  } catch (error) {
    console.error('Error verifying document:', error);
    throw error;
  }
}