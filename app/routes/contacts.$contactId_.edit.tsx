import type { ClientLoaderFunctionArgs } from "@remix-run/react";
import { ActionFunctionArgs,LoaderFunctionArgs, json,redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react" 
import invariant from "tiny-invariant";

import { getContact, updateContact } from "~/data";

export const action = async ({
    params,
    request
}: ActionFunctionArgs) => {
    invariant(params.contactId,"Missing contactId Param")
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    await updateContact(params.contactId,updates);
    return redirect(`/contacts/${params.contactId}`)
}


export const loader = async ({
    params,
}: LoaderFunctionArgs) => {
    invariant(params.contactId, "Missing contactId params");
    const contact  = await getContact(params.contactId);
    if(!contact) {
        throw new Response("Not Found", {status: 404});
    }
    return json({contact});
}


export default function EditContact() {
    const { contact } = useLoaderData<typeof loader>();
    const navigate = useNavigate();
    return (
        <Form id="contact-form" method="post">
            <p>
                <span>Name</span>
                <input 
                defaultValue={contact.first}
                aria-label="First name"
                name="first"
                type="text"
                placeholder="First"
                />
                <input
                defaultValue={contact.last}
                aria-label="Last name"
                name="last"
                placeholder="Last"
                type="text" />
            </p>

            <label>
                <span>Twitter</span>
                <input
                defaultValue={contact.twitter}
                name="twitter"
                placeholder="@ahadpatel18"
                type="text" />
            </label>

            <label>
                <span>Avatar URL</span>
                <input
                defaultValue={contact.avatar}
                name="avatar"
                placeholder="https://example.com/avatar.jpg"
                type="text" />
            </label>

            <label>
                <span>Notes</span>
                <textarea
                 name="notes"
                 cols={6}
                 defaultValue={contact.notes}
                 ></textarea>
            </label>

            <p>
                <button type="submit">Save</button>
                <button onClick={() => navigate(-1)} type="button">Cancel</button>
            </p>
        </Form>
    );
}