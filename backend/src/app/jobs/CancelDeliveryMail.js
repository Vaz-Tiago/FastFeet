import Mail from "../../lib/Mail";

class CancelDeliveryMail {
  get key() {
    return "CancelDeliveryMail";
  }

  async handle({ data }) {
    const { delivery } = data;

    await Mail.sendEmail({
      to: `${delivery.deliveryman.name} <${delivery.deliveryman.email}>`,
      subject: "ENTREGA CANCELADA",
      template: "canceldelivery",
      context: {
        deliveryman: delivery.deliveryman.name,
        id: delivery.id,
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

export default new CancelDeliveryMail();
