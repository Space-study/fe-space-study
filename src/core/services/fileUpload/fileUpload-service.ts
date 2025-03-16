import {httpClient} from '@/core/utils/axios'
import {RequestBuilder} from '@src/core/utils/axios/request-builder'

const requestBuilder = new RequestBuilder()
  .setPrefix('api')
  .setVersion('v1')
  .setResourcePath('users')

type UploadPhotoResponse = {
  path: string
}

export async function uploadPhoto(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const url = requestBuilder.setResourcePath('users/upload-photo').buildUrl()

  const response = await httpClient.post<UploadPhotoResponse, FormData>({
    url,
    body: formData,
    config: {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  })

  return response.path
}
