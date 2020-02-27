import Mail from "../../lib/Mail";

class NewDeliveryMail {
  get key() {
    return "NewDeliveryMail";
  }

  async handle({ data }) {
    const { delivery } = data;

    await Mail.sendEmail({
      to: `${delivery.deliveryman.name} <${delivery.deliveryman.email}>`,
      subject: "Nova Entrega",
      template: "newdelivery",
      context: {
        deliveryman: delivery.deliveryman.name,
        product: delivery.product,
        name: delivery.recipient.name,
        adress: delivery.recipient.adress,
        number: delivery.recipient.number,
        complement: delivery.recipient.complement,
        city: delivery.recipient.city,
        state: delivery.recipient.state,
        zipcode: delivery.recipient.zipcode
      }
    });
  }
}

export default new NewDeliveryMail();
