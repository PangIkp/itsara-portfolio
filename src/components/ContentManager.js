import { useEffect, useMemo, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import {
  createContentItem,
  deleteContentItem,
  fetchContentCollection,
  updateContentItem,
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

  const currentConfig = collectionConfig[selectedCollection];
  const currentItems = itemsByCollection[selectedCollection];

  const previewFields = useMemo(() => {
    return currentConfig.fields.filter((field) => formValues[field.name]);
  }, [currentConfig.fields, formValues]);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    setFormValues(buildInitialFormState(selectedCollection));
    setEditingId("");
    setStatusMessage("");
    setErrorMessage("");
  }, [selectedCollection]);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  function resetCurrentForm() {
    setFormValues(buildInitialFormState(selectedCollection));
    setEditingId("");
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

  return (
    <section className="content-manager" id="manage">
      <Container>
        <Row className="align-items-start">
          <Col lg={5}>
            <div className="manager-panel">
              <p className="manager-eyebrow">Content Manager</p>
              <h2>Manage Portfolio Data</h2>
              <p>
                Use this section to add, edit, and delete projects, certificates,
                and activities without touching the code again.
              </p>

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

              {statusMessage && <p className="success manager-message">{statusMessage}</p>}
              {errorMessage && <p className="danger manager-message">{errorMessage}</p>}

              <div className="manager-preview">
                <h3>Preview</h3>
                {previewFields.length === 0 && <p>Start typing to preview this item.</p>}
                {previewFields.map((field) => (
                  <p key={field.name}>
                    <strong>{field.label}:</strong> {formValues[field.name]}
                  </p>
                ))}
              </div>
            </div>
          </Col>

          <Col lg={7}>
            <div className="manager-panel manager-list-panel">
              <h3>{currentConfig.label}</h3>
              {isLoading && <p>Loading content manager...</p>}
              {!isLoading && currentItems.length === 0 && (
                <p>{currentConfig.emptyMessage}</p>
              )}
              {!isLoading && currentItems.map((item) => (
                <div className="manager-item" key={item.id}>
                  <div>
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
          </Col>
        </Row>
      </Container>
    </section>
  );
}
