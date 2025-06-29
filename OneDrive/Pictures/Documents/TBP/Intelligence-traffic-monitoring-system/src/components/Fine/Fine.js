import React from "react";
import { Button, Divider, Header, Icon, Message } from "semantic-ui-react";

export default class Fine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vehicleNumber: "",
      image: null,
      isVerified: false,
      message: "",
      plateNumber: "",
      loading: false,
    };
  }

  handleFileChange = (event) => {
    this.setState({
      image: event.target.files[0],
    });
  };

  handleSubmit = async () => {
    const { image } = this.state;
    if (!image) {
      this.setState({
        message: "Please upload an image",
      });
      return;
    }

    this.setState({ loading: true, message: "" });

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("http://localhost:5000/extract_plate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to extract plate number");
      }

      const data = await response.json();
      if (data.plate_number) {
        this.setState({
          plateNumber: data.plate_number,
          isVerified: true,
          message: "License plate detected!",
        });
      } else {
        this.setState({
          message: "No license plate detected",
        });
      }
    } catch (error) {
      console.error("Error extracting plate number:", error);
      this.setState({
        message: error.message,
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <div style={styles.center}>
        <div style={styles.form} className="fine">
          <Header as="h3">
            <Icon name="search" />
            <Header.Content>
              Find License Plate
              <Header.Subheader>Find the owner of the vehicle</Header.Subheader>
            </Header.Content>
          </Header>

          <input type="file" onChange={this.handleFileChange} />
          <br />
          <Button
            primary
            onClick={this.handleSubmit}
            loading={this.state.loading}
            disabled={this.state.loading}
          >
            FIND VEHICLE
          </Button>
          <br />
          <br />
          <Divider section />
          {this.state.message && (
            <Message
              success={this.state.isVerified}
              error={!this.state.isVerified}
            >
              {this.state.message}
            </Message>
          )}
          {this.state.plateNumber && (
            <div>
              <h4>Detected Plate Number: {this.state.plateNumber}</h4>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const styles = {
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  form: {
    textAlign: "center",
    width: "400px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
};