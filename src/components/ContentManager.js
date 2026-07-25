import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Col, Container, Form, Modal, Row, Toast, ToastContainer } from "react-bootstrap";
import { ArrowDown, ArrowUp } from "react-bootstrap-icons";
import {
  createContentItem,
  deleteContentItem,
  fetchContentCollection,
  loginAdmin,
  reorderContentItems,
  updateContentItem,
  verifyAdminSession,
} from "../utils/contentApi";

const collectionConfig = {
  projects: {
    label: "Projects",
    singularLabel: "Project",
    emptyMessage: "No projects added yet.",
    fields: [
      { name: "title", label: "Title", required: true },
      { name: "description", label: "Description", required: true, as: "textarea", rows: 4 },
      { name: "tools", label: "Tools", required: false },
      { name: "link", label: "Link", required: false },
      { name: "imageUrl", label: "Image Path / URL", required: false, placeholder: "/images/projects/example.png or https://example.com/project.png" },
    ],
  },
  certificates: {
    label: "Certificates",
    singularLabel: "Certificate",
    emptyMessage: "No certificates added yet.",
    fields: [
      { name: "title", label: "Title", required: true },
      { name: "description", label: "Description", required: true, as: "textarea", rows: 4 },
      { name: "imageUrl", label: "Image Path / URL", required: false, placeholder: "/images/certificates/example.jpg or https://example.com/certificate.jpg" },
    ],
  },
  activities: {
    label: "Activities",
    singularLabel: "Activity",
    emptyMessage: "No activities added yet.",
    fields: [
      { name: "title", label: "Title", required: true },
      { name: "description", label: "Description", required: true, as: "textarea", rows: 4 },
      { name: "imageUrl", label: "Image Path / URL", required: false, placeholder: "/images/activities/example.jpg or https://example.com/activity.jpg" },
    ],
  },
  skills: {
    label: "Tech Stack",
    singularLabel: "Skill",
    emptyMessage: "No tech stack items added yet.",
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "imageUrl", label: "Image Path / URL", required: false, placeholder: "/images/skills/example.png or https://example.com/skill.png" },
    ],
  },
};

function buildInitialFormState(collection) {
  return collectionConfig[collection].fields.reduce((accumulator, field) => {
    accumulator[field.name] = "";
    return accumulator;
  }, {});
}

export function ContentManager({ isAdminAuthenticated, onAdminAuthChange }) {
  const editorPanelRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState("projects");
  const [itemsByCollection, setItemsByCollection] = useState({
    projects: [],
    certificates: [],
    activities: [],
    skills: [],
  });
  const [formValues, setFormValues] = useState(buildInitialFormState("projects"));
  const [editingId, setEditingId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginValues, setLoginValues] = useState({
    username: "",
    password: "",
  });
  const [imagePreviewStatus, setImagePreviewStatus] = useState("idle");
  const [toastState, setToastState] = useState({
    show: false,
    variant: "success",
    title: "",
    message: "",
  });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [movingItemId, setMovingItemId] = useState("");

  const currentConfig = collectionConfig[selectedCollection];
  const currentItems = itemsByCollection[selectedCollection];
  const previewImageUrl = formValues.imageUrl ? formValues.imageUrl.trim() : "";
  const editorTitle = editingId ? "Update Item" : "Create New Item";
  const editorDescription = editingId
    ? "You are editing an existing item. Save when the content looks correct."
    : "Use this form to add a new portfolio item without touching source files.";

  const previewFields = useMemo(() => {
    return currentConfig.fields.filter((field) => formValues[field.name]);
  }, [currentConfig.fields, formValues]);

  function showManagerToast(variant, title, message) {
    setToastState({
      show: true,
      variant,
      title,
      message,
    });
  }

  useEffect(() => {
    let isMounted = true;

    async function checkAdminSession() {
      const authenticated = await verifyAdminSession();

      if (!isMounted) {
        return;
      }

      setIsAuthenticated(authenticated);
      setIsCheckingAuth(false);
      onAdminAuthChange?.(authenticated);
    }

    checkAdminSession();

    return () => {
      isMounted = false;
    };
  }, [onAdminAuthChange]);

  useEffect(() => {
    if (isAdminAuthenticated) {
      return;
    }

    setIsAuthenticated(false);
    setIsLoading(false);
    setItemsByCollection({
      projects: [],
      certificates: [],
      activities: [],
      skills: [],
    });
    setFormValues(buildInitialFormState(selectedCollection));
    setEditingId("");
    setErrorMessage("");
    setDeleteTarget(null);
  }, [isAdminAuthenticated, selectedCollection]);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function loadAllCollections() {
      try {
        const [projects, certificates, activities, skills] = await Promise.all([
          fetchContentCollection("projects"),
          fetchContentCollection("certificates"),
          fetchContentCollection("activities"),
          fetchContentCollection("skills"),
        ]);

        if (!isMounted) {
          return;
        }

        setItemsByCollection({
          projects,
          certificates,
          activities,
          skills,
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        showManagerToast("error", "Load failed", "Unable to load content manager data right now.");
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
    setErrorMessage("");
    setDeleteTarget(null);
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
    setIsSubmitting(true);

    try {
      await loginAdmin(loginValues.username.trim(), loginValues.password);
      setIsAuthenticated(true);
      onAdminAuthChange?.(true);
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

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
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

      showManagerToast(
        "success",
        editingId ? "Updated" : "Created",
        editingId
          ? `${currentConfig.label.slice(0, -1)} updated successfully.`
          : `${currentConfig.label.slice(0, -1)} created successfully.`
      );
      resetCurrentForm();
    } catch (error) {
      showManagerToast("error", "Save failed", error.message || "Unable to save this item.");
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
    setErrorMessage("");

    window.requestAnimationFrame(() => {
      if (!editorPanelRef.current) {
        return;
      }

      const navbarOffset = 110;
      const editorTop =
        editorPanelRef.current.getBoundingClientRect().top + window.scrollY - navbarOffset;

      window.scrollTo({
        top: Math.max(editorTop, 0),
        behavior: "smooth",
      });
    });
  }

  function handleDelete(id) {
    const item = currentItems.find((currentItem) => currentItem.id === id);

    if (!item) {
      return;
    }

    setDeleteTarget(item);
  }

  async function confirmDelete() {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteContentItem(selectedCollection, deleteTarget.id);

      setItemsByCollection((currentCollections) => ({
        ...currentCollections,
        [selectedCollection]: currentCollections[selectedCollection].filter(
          (item) => item.id !== deleteTarget.id
        ),
      }));

      if (editingId === deleteTarget.id) {
        resetCurrentForm();
      }

      showManagerToast(
        "success",
        "Deleted",
        `${currentConfig.singularLabel} deleted successfully.`
      );
      setDeleteTarget(null);
    } catch (error) {
      showManagerToast(
        "error",
        "Delete failed",
        error.message || "Unable to delete this item."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleMoveItem(id, direction) {
    const currentIndex = currentItems.findIndex((item) => item.id === id);
    const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (currentIndex === -1 || nextIndex < 0 || nextIndex >= currentItems.length) {
      return;
    }

    const nextItems = [...currentItems];
    const [movedItem] = nextItems.splice(currentIndex, 1);
    nextItems.splice(nextIndex, 0, movedItem);

    setMovingItemId(id);

    try {
      const reorderedItems = await reorderContentItems(
        selectedCollection,
        nextItems.map((item) => item.id)
      );

      setItemsByCollection((currentCollections) => ({
        ...currentCollections,
        [selectedCollection]: reorderedItems,
      }));

      showManagerToast(
        "success",
        "Order updated",
        `${currentConfig.label} order updated successfully.`
      );
    } catch (error) {
      showManagerToast(
        "error",
        "Reorder failed",
        error.message || "Unable to update the item order."
      );
    } finally {
      setMovingItemId("");
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
        <div className="manager-status-stack">
          {isLoading && (
            <div className="manager-notice manager-notice-info">
              Loading content manager data...
            </div>
          )}
        </div>
        <ToastContainer position="top-end" className="manager-toast-container">
          <Toast
            bg={toastState.variant === "error" ? "danger" : "success"}
            onClose={() => setToastState((currentState) => ({ ...currentState, show: false }))}
            show={toastState.show}
            delay={2600}
            autohide
          >
            <Toast.Header closeButton>
              <strong className="me-auto">{toastState.title}</strong>
            </Toast.Header>
            <Toast.Body className="manager-toast-body">{toastState.message}</Toast.Body>
          </Toast>
        </ToastContainer>
        <div className="manager-dashboard-stack">
          <div className="manager-panel manager-editor-panel" ref={editorPanelRef}>
            <div className="manager-panel-header">
              <div>
                <p className="manager-eyebrow">Editor</p>
                <h2>{editorTitle}</h2>
                <p>{editorDescription}</p>
              </div>
            </div>

            <div className="manager-tabs">
              {Object.entries(collectionConfig).map(([collectionKey, config]) => (
                <button
                  key={collectionKey}
                  type="button"
                  className={selectedCollection === collectionKey ? "active" : ""}
                  onClick={() => setSelectedCollection(collectionKey)}
                >
                  <span>{config.label}</span>
                  <small>{itemsByCollection[collectionKey].length}</small>
                </button>
              ))}
            </div>

            <div className="manager-editor-layout">
              <div className="manager-editor-form-column">
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
              </div>

              <div className="manager-preview-column">
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
                            alt={formValues.title || formValues.name || "Preview"}
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
            </div>
          </div>

          <div className="manager-panel manager-list-panel">
            <div className="manager-panel-header">
              <div>
                <p className="manager-eyebrow">Collection</p>
                <h3>{currentConfig.label}</h3>
                <p>Review, edit, or remove existing content from this collection.</p>
              </div>
              <div className="manager-list-header-meta">
                <div className="manager-collection-count">
                  {currentItems.length} item{currentItems.length === 1 ? "" : "s"}
                </div>
                <div className="manager-list-hint">
                  Click edit to load an item into the form above.
                </div>
              </div>
            </div>
            <div className="manager-list-scroll-area">
              {!isLoading && currentItems.length === 0 && (
                <div className="manager-empty-state">
                  <h4>No items yet</h4>
                  <p>{currentConfig.emptyMessage}</p>
                </div>
              )}
              {!isLoading && currentItems.length > 0 && (
                <div className="manager-item-grid">
                    {currentItems.map((item, itemIndex) => (
                      <div className="manager-item-card" key={item.id}>
                      <div className="manager-item-media">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.title || item.name} />
                        ) : (
                          <div className="manager-item-media-empty">No image</div>
                        )}
                      </div>
                      <div className="manager-item-content">
                        <p className="manager-item-id">{item.id}</p>
                        <h4>{item.title || item.name}</h4>
                        <div className="manager-item-tags">
                          <span>{currentConfig.singularLabel}</span>
                          {item.link && <span>Has link</span>}
                          {item.tools && <span>Tools listed</span>}
                        </div>
                        {item.description && <p>{item.description}</p>}
                        {"tools" in item && item.tools && (
                          <p><strong>Tools:</strong> {item.tools}</p>
                        )}
                        {"link" in item && item.link && (
                          <p><strong>Link:</strong> {item.link}</p>
                        )}
                        <p className="manager-item-image-path"><strong>Image:</strong> {item.imageUrl || "-"}</p>
                      </div>
                      <div className="manager-item-actions">
                        <div className="manager-item-order-actions">
                          <Button
                            type="button"
                            variant="outline-secondary"
                            onClick={() => handleMoveItem(item.id, "up")}
                            disabled={itemIndex === 0 || movingItemId === item.id}
                            aria-label={`Move ${item.title || item.name} up`}
                          >
                            <ArrowUp />
                          </Button>
                          <Button
                            type="button"
                            variant="outline-secondary"
                            onClick={() => handleMoveItem(item.id, "down")}
                            disabled={itemIndex === currentItems.length - 1 || movingItemId === item.id}
                            aria-label={`Move ${item.title || item.name} down`}
                          >
                            <ArrowDown />
                          </Button>
                        </div>
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
          </div>
        </div>
      </Container>
      <Modal
        centered
        show={Boolean(deleteTarget)}
        onHide={() => !isDeleting && setDeleteTarget(null)}
        dialogClassName="manager-confirm-modal"
      >
        <Modal.Header closeButton={!isDeleting}>
          <Modal.Title>Delete {currentConfig.singularLabel}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Delete <strong>{deleteTarget?.title || deleteTarget?.name || deleteTarget?.id}</strong> from{" "}
          {currentConfig.label}? This action updates the portfolio immediately.
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            variant="outline-secondary"
            onClick={() => setDeleteTarget(null)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={confirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}
