export default class UserDTO {
  email;
  password;
  firstName;
  lastName;
  address;
  phoneNumber;
  gender;
  image;
  roleId;
  positionId;

  constructor(data) {
    this.email = data.email;
    this.password = data.password;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.address = data.address;
    this.phoneNumber = data.phoneNumber;
    this.gender = data.gender;
    this.image = data.image;
    this.roleId = data.roleId;
    this.positionId = data.positionId;
  }
}
