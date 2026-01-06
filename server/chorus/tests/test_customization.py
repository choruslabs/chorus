from uuid import UUID


class TestConversationCustomization:
    def test_read_empty_customization(self, authenticated_client, create_conversation):
        conversation_id = create_conversation(authenticated_client).json()["id"]
        conversation_id = UUID(conversation_id)

        response = authenticated_client.get(
            f"/conversations/{conversation_id}/customization"
        )
        assert response.status_code == 200
        data = response.json()
        assert data["theme_color"] is None
        assert data["header_name"] is None
        assert data["knowledge_base_content"] is None

    def test_update_and_read_customization(
        self, authenticated_client, create_conversation
    ):
        conversation_id = create_conversation(authenticated_client).json()["id"]
        conversation_id = UUID(conversation_id)

        update_data = {
            "theme_color": "#ff5733",
            "header_name": "Custom Header",
            "knowledge_base_content": "This is some knowledge base content.",
        }
        response = authenticated_client.put(
            f"/conversations/{conversation_id}/customization",
            json=update_data,
        )
        assert response.status_code == 200
        data = response.json()
        assert data == update_data

        # Read back the customization
        response = authenticated_client.get(
            f"/conversations/{conversation_id}/customization"
        )
        assert response.status_code == 200
        data = response.json()
        assert data == update_data

    def test_normalize_theme_color(self, authenticated_client, create_conversation):
        conversation_id = create_conversation(authenticated_client).json()["id"]
        conversation_id = UUID(conversation_id)

        update_data = {
            "theme_color": "#FF5733",
        }
        response = authenticated_client.put(
            f"/conversations/{conversation_id}/customization",
            json=update_data,
        )
        assert response.status_code == 200
        data = response.json()
        assert data["theme_color"] == "#ff5733"
