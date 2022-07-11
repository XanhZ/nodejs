class Regex {
  static PHONENUMBER = /(84|0[3|5|7|8|9])+([0-9]{8})\b/

  static IMAGE_FILENAME = /.+(\.(jpg|jpeg|png|gif|bmp)$)/i

  static SPECIAL_CHAR = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
}

export default Regex
