import { useEffect, useMemo, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import {
  createContentItem,
  deleteContentItem,
  fetchContentCollection,
  loginAdmin,
  logoutAdmin,
  updateContentItem,
  verifyAdminSession,
} from "../utils/contentApi";

const collectionConfig = {
  projects: {
    label: "Projects",
    emptyMessage: "No projects added yet.",
    fields: [
      { name: "title", label: "Title", required: true },
      { name: "description", label: "Description", required: true, as: "textarea", rows: 4 },
      { name: "tools", label: "Tools", required: false },
      { name: "link", label: "Link", required: false },
      { name: "imageUrl", label: "Image Path", required: true, placeholder: "/images/projects/example.png" },
    ],
  },
  certificates: {
    label: "Certificates",
    emptyMessage: "No certificates added yet.",
    fields: [
      { name: "title", label: "Title", required: true },
      { name: "description", label: "Description", required: true, as: "textarea", rows: 4 },
      { name: "imageUrl", label: "Image Path", required: true, placeholder: "/images/certificates/example.jpg" },
    ],
  },
  activities: {
    label: "Activities",
    emptyMessage: "No activities added yet.",
    fields: [
      { name: "title", label: "Title", required: true },
      { name: "description", label: "Description", required: true, as: "textarea", rows: 4 },
      { name: "imageUrl", label: "Image Path", required: true, placeholder: "/images/activities/example.jpg" },
    ],
  },
};

function buildInitialFormState(collection) {
  return collectionConfig[collection].fields.reduce((accumulator, field) => {
    accumulator[field.name] = "";
    return accumulator;
  }, {});
}

export function ContentManager() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState("projects");
  const [itemsByCollection, setItemsByCollection] = useState({
    projects: [],
    certificates: [],
    activities: [],
  });
  const [formValues, setFormValues] = useState(buildInitialFormState("projects"));
  const [editingId, setEditingId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [loginValues, setLoginValues] = useState({
    username: "",
    password: "",
  });
  const [imagePreviewStatus, setImagePreviewStatus] = useState("idle");

  const currentConfig = collectionConfig[selectedCollection];
  const currentItems = itemsByCollection[selectedCollection];
  const previewImageUrl = formValues.imageUrl ? formValues.imageUrl.trim() : "";
  const totalItems =
    itemsByCollection.projects.length +
    itemsByCollection.certificates.length +
    itemsByCollection.activities.length;
  const editorTitle = editingId ? "Update Item" : "Create New Item";
  const editorDescription = editingId
    ? "You are editing an existing item. Save when the content looks correct."
    : "Use this form to add a new portfolio item without touching source files.";

  const previewFields = useMemo(() => {
    return currentConfig.fields.filter((field) => formValues[field.name]);
  }, [currentConfig.fields, formValues]);

  useEffect(() => {
    let isMounted = true;

    async function checkAdminSession() {
      const authenticated = await verifyAdminSession();

      if (!isMounted) {
        return;
      }

      setIsAuthenticated(authenticated);
      setIsCheckingAuth(false);
    }

    checkAdminSession();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function loadAllCollections() {
      try {
        const [projects, certificates, activities] = await Promise.all([
          fetchContentCollection("projects"),
          fetchContentCollection("certificates"),
          fetchContentCollection("activities"),
        ]);

        if (!isMounted) {
          return;
        }

        setItemsByCollection({
          projects,
          certificates,
          activities,
        });
        setErrorMessage("");
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage("Unable to load content manager data right now.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAllCollections();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    setFormValues(buildInitialFormState(selectedCollection));
    setEditingId("");
    setStatusMessage("");
    setErrorMessage("");
  }, [selectedCollection]);

  useEffect(() => {
    if (!previewImageUrl) {
      setImagePreviewStatus("idle");
      return;
    }

    setImagePreviewStatus("loading");
  }, [previewImageUrl]);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  function handleLoginInputChange(event) {
    const { name, value } = event.target;
    setLoginValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  function resetCurrentForm() {
    setFormValues(buildInitialFormState(selectedCollection));
    setEditingId("");
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setStatusMessage("");
    setIsSubmitting(true);

    try {
      await loginAdmin(loginValues.username.trim(), loginValues.password);
      setIsAuthenticated(true);
      setIsLoading(true);
      setLoginValues({
        username: "",
        password: "",
      });
    } catch (error) {
      setErrorMessage(error.message || "Unable to log in as admin.");
    } finally {
      setIsSubmitting(false);
      setIsCheckingAuth(false);
    }
  }

  async function handleLogout() {
    await logoutAdmin().catch(() => null);
    setIsAuthenticated(false);
    setItemsByCollection({
      projects: [],
      certificates: [],
      activities: [],
    });
    resetCurrentForm();
    setStatusMessage("");
    setErrorMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage("");
    setErrorMessage("");

    try {
      const payload = Object.fromEntries(
        Object.entries(formValues).map(([key, value]) => [key, value.trim()])
      );

      const savedItem = editingId
        ? await updateContentItem(selectedCollection, editingId, payload)
        : await createContentItem(selectedCollection, payload);

      setItemsByCollection((currentCollections) => {
        const currentItemsForCollection = currentCollections[selectedCollection];

        const nextItems = editingId
          ? currentItemsForCollection.map((item) =>
              item.id === editingId ? savedItem : item
            )
          : [...currentItemsForCollection, savedItem];

        return {
          ...currentCollections,
          [selectedCollection]: nextItems,
        };
      });

      setStatusMessage(
        editingId
          ? `${currentConfig.label.slice(0, -1)} updated successfully.`
          : `${currentConfig.label.slice(0, -1)} created successfully.`
      );
      resetCurrentForm();
    } catch (error) {
      setErrorMessage(error.message || "Unable to save this item.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleEdit(item) {
    const nextFormValues = buildInitialFormState(selectedCollection);

    currentConfig.fields.forEach((field) => {
      nextFormValues[field.name] = item[field.name] || "";
    });

    setFormValues(nextFormValues);
    setEditingId(item.id);
    setStatusMessage("");
    setErrorMessage("");
  }

  async function handleDelete(id) {
    const shouldDelete = window.confirm("Delete this item?");

    if (!shouldDelete) {
      return;
    }

    setStatusMessage("");
    setErrorMessage("");

    try {
      await deleteContentItem(selectedCollection, id);

      setItemsByCollection((currentCollections) => ({
        ...currentCollections,
        [selectedCollection]: currentCollections[selectedCollection].filter(
          (item) => item.id !== id
        ),
      }));

      if (editingId === id) {
        resetCurrentForm();
      }

      setStatusMessage(`${currentConfig.label.slice(0, -1)} deleted successfully.`);
    } catch (error) {
      setErrorMessage(error.message || "Unable to delete this item.");
    }
  }

  if (isCheckingAuth) {
    return (
      <section className="content-manager" id="manage">
        <Container>
          <div className="manager-auth-shell">
            <div className="manager-panel manager-auth-panel">
              <p className="manager-eyebrow">Admin Access</p>
              <h2>Checking Session</h2>
              <p>Checking admin session...</p>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="content-manager" id="manage">
        <Container>
          <div className="manager-auth-shell">
            <Row className="justify-content-center manager-auth-layout">
              <Col lg={6} xl={5}>
                <div className="manager-panel manager-auth-panel manager-login-panel">
                  <p className="manager-eyebrow">Admin Only</p>
                  <h2>Log In to Manage Content</h2>
                  <p className="manager-auth-copy">
                    This page is not linked in the public navigation. Sign in
                    with your admin account to edit projects, certificates, and
                    activities.
                  </p>

                  <div className="manager-auth-badges manager-auth-badges-compact">
                    <span>Private route</span>
                    <span>Protected API</span>
                    <span>Session based</span>
                  </div>

                  <Form onSubmit={handleLoginSubmit} className="manager-form">
                    <Form.Group className="mb-3">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        name="username"
                        value={loginValues.username}
                        onChange={handleLoginInputChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={loginValues.password}
                        onChange={handleLoginInputChange}
                        required
                      />
                    </Form.Group>
                    <div className="manager-actions">
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Logging in..." : "Log In"}
                      </Button>
                    </div>
                  </Form>

                  {errorMessage && <p className="danger manager-message">{errorMessage}</p>}
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="content-manager" id="manage">
      <Container>
        <div className="manager-hero">
          <div>
            <p className="manager-eyebrow">Admin Dashboard</p>
            <h1>Manage Portfolio Content</h1>
            <p className="manager-hero-copy">
              Update public portfolio content from one place. Changes are saved
              to the API-backed content store and reflected on the website.
            </p>
          </div>
          <div className="manager-hero-meta">
            <span>{totalItems} Total Items</span>
            <span>{itemsByCollection.projects.length} Projects</span>
            <span>{itemsByCollection.certificates.length} Certificates</span>
            <span>{itemsByCollection.activities.length} Activities</span>
          </div>
        </div>
        <div className="manager-status-stack">
          {isLoading && (
            <div className="manager-notice manager-notice-info">
              Loading content manager data...
            </div>
          )}
          {statusMessage && (
            <div className="manager-notice manager-notice-success">
              {statusMessage}
            </div>
          )}
          {errorMessage && (
            <div className="manager-notice manager-notice-error">
              {errorMessage}
            </div>
          )}
        </div>
        <Row className="align-items-start manager-dashboard-layout">
          <Col lg={5} xl={4}>
            <div className="manager-panel manager-editor-panel">
              <div className="manager-panel-header">
                <div>
                  <p className="manager-eyebrow">Editor</p>
                  <h2>{editorTitle}</h2>
                  <p>{editorDescription}</p>
                </div>
                <Button type="button" variant="outline-secondary" onClick={handleLogout}>
                  Log Out
                </Button>
              </div>

              <div className="manager-tabs">
                {Object.entries(collectionConfig).map(([collectionKey, config]) => (
                  <button
                    key={collectionKey}
                    type="button"
                    className={selectedCollection === collectionKey ? "active" : ""}
                    onClick={() => setSelectedCollection(collectionKey)}
                  >
                    {config.label}
                  </button>
                ))}
              </div>

              <div className="manager-editor-meta">
                <div className="manager-editor-meta-card">
                  <span className="manager-editor-meta-label">Collection</span>
                  <strong>{currentConfig.label}</strong>
                </div>
                <div className="manager-editor-meta-card">
                  <span className="manager-editor-meta-label">Mode</span>
                  <strong>{editingId ? "Editing existing item" : "Creating new item"}</strong>
                </div>
              </div>

              <Form onSubmit={handleSubmit} className="manager-form">
                {currentConfig.fields.map((field) => (
                  <Form.Group className="mb-3" key={field.name}>
                    <Form.Label>{field.label}</Form.Label>
                    <Form.Control
                      as={field.as}
                      rows={field.rows}
                      name={field.name}
                      value={formValues[field.name]}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  </Form.Group>
                ))}

                <div className="manager-actions">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : editingId ? "Update Item" : "Add Item"}
                  </Button>
                  {editingId && (
                    <Button
                      type="button"
                      variant="outline-secondary"
                      onClick={resetCurrentForm}
                    >
                      Cancel Edit
                    </Button>
                  )}
                </div>
              </Form>

              <div className="manager-preview">
                <div className="manager-preview-header">
                  <div>
                    <p className="manager-eyebrow">Preview</p>
                    <h3>Quick Preview</h3>
                  </div>
                  {editingId && <span className="manager-preview-tag">Editing</span>}
                </div>
                {previewFields.length === 0 && (
                  <p className="manager-preview-empty">Start typing to preview this item.</p>
                )}
                {previewFields.length > 0 && (
                  <div className="manager-preview-card">
                    {previewImageUrl && (
                      <div className="manager-image-preview">
                        <img
                          src={previewImageUrl}
                          alt={formValues.title || "Preview"}
                          onLoad={() => setImagePreviewStatus("ready")}
                          onError={() => setImagePreviewStatus("error")}
                        />
                        <span>Image preview</span>
                        {imagePreviewStatus === "loading" && (
                          <p className="manager-image-preview-note">
                            Loading preview...
                          </p>
                        )}
                        {imagePreviewStatus === "error" && (
                          <p className="manager-image-preview-note manager-image-preview-note-error">
                            Preview unavailable. Check the image path.
                          </p>
                        )}
                      </div>
                    )}
                    {previewFields.map((field) => (
                      <p key={field.name}>
                        <strong>{field.label}:</strong> {formValues[field.name]}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Col>

          <Col lg={7} xl={8}>
            <div className="manager-panel manager-list-panel">
              <div className="manager-panel-header">
                <div>
                  <p className="manager-eyebrow">Collection</p>
                  <h3>{currentConfig.label}</h3>
                  <p>Review, edit, or remove existing content from this collection.</p>
                </div>
                <div className="manager-collection-count">
                  {currentItems.length} item{currentItems.length === 1 ? "" : "s"}
                </div>
              </div>

              {!isLoading && currentItems.length === 0 && (
                <div className="manager-empty-state">
                  <h4>No items yet</h4>
                  <p>{currentConfig.emptyMessage}</p>
                </div>
              )}
              {!isLoading && currentItems.length > 0 && (
                <div className="manager-item-grid">
                  {currentItems.map((item) => (
                    <div className="manager-item-card" key={item.id}>
                      <div className="manager-item-content">
                        <p className="manager-item-id">{item.id}</p>
                        <h4>{item.title}</h4>
                        <p>{item.description}</p>
                        {"tools" in item && item.tools && (
                          <p><strong>Tools:</strong> {item.tools}</p>
                        )}
                        {"link" in item && item.link && (
                          <p><strong>Link:</strong> {item.link}</p>
                        )}
                        <p><strong>Image:</strong> {item.imageUrl}</p>
                      </div>
                      <div className="manager-item-actions">
                        <Button type="button" onClick={() => handleEdit(item)}>
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="outline-danger"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
