import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import LayoutOne from "../../layouts/LayoutOne";
import { useForm } from "react-hook-form";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

import { useMutation } from "@apollo/react-hooks";
import INSERT_MESSAGE from "../../graphql/InsertMessage";

const Contact = ({ location }) => {
  const { handleSubmit, register, errors } = useForm();
  const [messageSent, setMessageSent] = useState(false)
  const { pathname } = location;
  const [insertMessage] = useMutation(INSERT_MESSAGE, {
    onCompleted(data) {
      setMessageSent(true)
    },
  });

  const onSubmit = (values, e)=>{
    insertMessage({
      variables: {
        message: {
          name: values.name,
          email: values.email,
          subject: values.subject,
          message: values.message
        }
      }
    })
    e.target.reset()
  }

  return (
    <Fragment>
      <MetaTags>
        <title>Micota. | İletişim</title>
        <meta
          name='description'
          content='Contact of flone react minimalist eCommerce template.'
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>
        Anasayfa
      </BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        İletişim
      </BreadcrumbsItem>
      <LayoutOne headerTop='visible'>
        {/* breadcrumb */}
        <Breadcrumb />
        <div className='contact-area pt-100 pb-100'>
          <div className='container'>
            <div className='custom-row-2'>
              <div className='col-lg-4 col-md-5'>
                <div className='contact-info-wrap'>
                  <div className='single-contact-info'>
                    <div className='contact-icon'>
                      <i className='fa fa-phone' />
                    </div>
                    <div className='contact-info-dec'>
                      <p>0216 693 13 50</p>
                    </div>
                  </div>
                  <div className='single-contact-info'>
                    <div className='contact-icon'>
                      <i className='fa fa-globe' />
                    </div>
                    <div className='contact-info-dec'>
                      <p>
                        <a href='mailto:urname@email.com'>urname@email.com</a>
                      </p>
                      <p>
                        <a href='//urwebsitenaem.com'>urwebsitenaem.com</a>
                      </p>
                    </div>
                  </div>
                  <div className='single-contact-info'>
                    <div className='contact-icon'>
                      <i className='fa fa-map-marker' />
                    </div>
                    <div className='contact-info-dec'>
                      <p>Küçüksu Mah. Asma Sok. No: 10 C-4</p>
                      <p>Kandilli Üsküdar</p>
                    </div>
                  </div>
                  <div className='contact-social text-center'>
                    <h3>Takip et</h3>
                    <ul>
                      <li>
                        <a href='//facebook.com'>
                          <i className='fa fa-facebook' />
                        </a>
                      </li>
                      <li>
                        <a href='//pinterest.com'>
                          <i className='fa fa-pinterest-p' />
                        </a>
                      </li>
                      <li>
                        <a href='//thumblr.com'>
                          <i className='fa fa-tumblr' />
                        </a>
                      </li>
                      <li>
                        <a href='//vimeo.com'>
                          <i className='fa fa-vimeo' />
                        </a>
                      </li>
                      <li>
                        <a href='//twitter.com'>
                          <i className='fa fa-twitter' />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className='col-lg-8 col-md-7'>
                <div className='contact-form'>
                  <div className='contact-title mb-30'>
                    <h2>Mesaj gönder</h2>
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)} className='contact-form-style'>
                    <div className='row'>
                      <div className='col-lg-6'>
                        <input name='name' placeholder='İsim*' type='text' ref={register({
                      required: "İsim boş bırakılamaz.",
                      pattern: {
                        value: /^[a-zA-ZğüşöçıİĞÜŞÖÇ ]+$/,
                        message:
                          "İsim boş bırakılamaz. ",
                      },
                    })} />
                    {errors.name && (
                    <div className='alert alert-danger small' role='alert'>
                      {errors.name.message}
                    </div>
                  )}
                      </div>
                      <div className='col-lg-6'>
                        <input name='email' placeholder='Email*' type='email' ref={register({
                      required: "Email boş bırakılamaz ",
                      pattern: {
                        value: /^\s*[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\s*$/i,
                        message: "Geçerli bir email girin.",
                      },
                    })}/>
                    {errors.email && (
                    <div className='alert alert-danger small' role='alert'>
                      {errors.email.message}
                    </div>
                  )}
                      </div>
                      <div className='col-lg-12'>
                        <input name='subject' placeholder='Konu*' type='text' ref={register({
                      required: "Konu boş bırakılamaz.",
                      pattern: {
                        value: /^[a-zA-ZğüşöçıİĞÜŞÖÇ ]+$/,
                        message:
                          "Konu boş bırakılamaz. ",
                      },
                    })} />
                    {errors.subject && (
                    <div className='alert alert-danger small' role='alert'>
                      {errors.subject.message}
                    </div>
                  )}
                      </div>
                      <div className='col-lg-12'>
                        <textarea
                          maxLength="256"
                          name='message'
                          placeholder='Mesaj*'
                          defaultValue={""}
                          ref={register({
                            required: "Mesaj boş bırakılamaz.",
                            pattern: {
                              value: /^[a-zA-ZğüşöçıİĞÜŞÖÇ ]+$/,
                              message:
                                "Mesaj boş bırakılamaz. ",
                            },
                          })}
                        />{errors.message && (
                          <div className='alert alert-danger small' role='alert'>
                            {errors.message.message}
                          </div>
                        )}
                        <button className='submit' type='submit'>
                          GÖNDER
                        </button>
                      </div>
                    </div>
                  </form>
                  {messageSent&& 
                  <div className='alert alert-success text-center' role='alert'>
                    Mesajınız bize ulaştı<i className='fa fa-smile-o mb-3'></i> En kısa sürede email adresinize cevap göndereceğiz. 
                  </div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

Contact.propTypes = {
  location: PropTypes.object,
};

export default Contact;
