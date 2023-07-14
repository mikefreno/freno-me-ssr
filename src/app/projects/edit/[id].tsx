import Navbar from "@/components/Navbar";
import { Button, Checkbox, Input } from "@nextui-org/react";
import Head from "next/head";
import { useCallback, useEffect, useRef, useState } from "react";
import Dropzone from "@/components/Dropzone";
import type { Project, ProjectLike, User, Comment } from "@prisma/client";
import { api } from "@/utils/api";
import TextEditor from "@/components/TextEditor";
import { useSession } from "next-auth/react";
import AdjustableLoadingElement from "@/components/AdjustableLoadingElement";
import { useRouter } from "next/router";

export default function ProjectEdit() {
  const router = useRouter();
  const { id } = router.query;
  const titleRef = useRef<HTMLInputElement>(null);
  const subTitleRef = useRef<HTMLInputElement>(null);
  const [editorContent, setEditorContent] = useState<string>("");
  const [publishing, setPublishing] = useState<boolean>(false);
  const [project, setProject] = useState<
    | Project & {
        comments: Comment[];
        author: User;
        likes: ProjectLike[];
      }
  >();

  const [bannerImage, setBannerImage] = useState<File | Blob | null>(null);
  const [bannerImageExt, setBannerImageExt] = useState<string>();

  const [bannerImageHolder, setBannerImageHolder] = useState<string | ArrayBuffer | null>(null);

  const projectResp = api.projects.getProjectByIdQuery.useQuery(id as string);

  const editProjectMutation = api.projects.editProject.useMutation({});
  const serverBannerMutation = api.projects.updateProjectBanner.useMutation({});
  const s3TokenMutation = api.misc.returnS3Token.useMutation();

  const { data: session, status } = useSession();

  useEffect(() => {
    if (projectResp.data) {
      setProject(projectResp.data);
    }
  }, [projectResp]);

  const postProject = async () => {
    if (titleRef.current && titleRef.current.value.length == 0) {
      alert("Title is required to Post project");
    } else if (confirm("Are you sure you want to post this project?")) {
      if (subTitleRef.current && titleRef.current && titleRef.current.value.length > 0 && project) {
        const res = await editProjectMutation.mutateAsync({
          id: project.id,
          title: titleRef.current.value,
          subtitle: subTitleRef.current.value.length > 0 ? subTitleRef.current.value : undefined,
          body: editorContent,
          published: project.published ? undefined : true,
        });
        if (bannerImage && res) {
          await AddImageToS3AndDB(res);
        }
        await router.push("/projects");
      }
    }
  };

  const saveAsDraft = async () => {
    if (titleRef.current && titleRef.current.value.length == 0) {
      alert("Title is required to save project");
    } else if (
      subTitleRef.current &&
      titleRef.current &&
      titleRef.current.value.length > 0 &&
      project
    ) {
      const res = await editProjectMutation.mutateAsync({
        id: project.id,
        title: titleRef.current.value !== project.title ? titleRef.current.value : undefined,
        subtitle:
          subTitleRef.current.value !== project.subtitle ? subTitleRef.current.value : undefined,
        body: editorContent !== project.body ? editorContent : undefined,
        published: project.published ? false : undefined,
      });
      if (bannerImage && res) {
        await AddImageToS3AndDB(res);
      }
    }
  };

  const handleBannerImageDrop = useCallback((acceptedFiles: Blob[]) => {
    acceptedFiles.forEach((file: Blob) => {
      setBannerImage(file);
      const ext = file.type.split("/")[1];
      if (ext) {
        setBannerImageExt(ext);
      } else {
        throw new Error("file extension not found");
      }

      const reader = new FileReader();
      reader.onload = () => {
        const str = reader.result;
        setBannerImageHolder(str);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const AddImageToS3AndDB = async (project: Project) => {
    if (bannerImage) {
      const s3TokenReturn = await s3TokenMutation.mutateAsync({
        id: project.id.toString(),
        ext: bannerImageExt as string,
        category: "projects",
      });

      //update server with image url
      fetch(s3TokenReturn.uploadURL, {
        method: "PUT",
        body: bannerImage as File,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          // Continue your code here
        })
        .catch((err) => {
          console.log(err);
        });

      serverBannerMutation.mutate({
        projectID: project.id,
        url: s3TokenReturn.key,
      });
    }
  };

  if (status !== "loading" && session?.user.email !== "michael@freno.me") {
    setTimeout(async () => {
      {
        await router.push("/projects");
      }
    }, 1000);
    return (
      <div className="h-screen w-screen bg-zinc-100 dark:bg-zinc-800">
        <AdjustableLoadingElement />
      </div>
    );
  }

  return (
    <div className="bg-zinc-100 dark:bg-zinc-900">
      <Head>
        <title>Edit Project | Freno.me</title>
        <meta name="description" content="Projects Main Page" />
      </Head>
      <Navbar />
      <div className=" px-8 py-32">
        <div className="flex h-full w-full justify-center">
          <div className="w-1/2">
            <div className="flex h-full w-full flex-col">
              <div className=" py-8">
                <Input
                  ref={titleRef}
                  clearable
                  underlined
                  defaultValue={project?.title}
                  labelPlaceholder="Project Title"
                  required
                  color="primary"
                  size="xl"
                  css={{ width: "100%", zIndex: 0 }}
                />
              </div>
              <div className="py-8">
                <Input
                  ref={subTitleRef}
                  clearable
                  underlined
                  defaultValue={project?.subtitle ? project.subtitle : ""}
                  labelPlaceholder="Project Subtitle (optional)"
                  color="primary"
                  css={{ width: "100%", zIndex: 0 }}
                />
              </div>
              <div className="flex justify-center py-8">
                <Dropzone
                  onDrop={handleBannerImageDrop}
                  acceptedFiles={"image/jpg, image/jpeg, image/png"}
                  fileHolder={bannerImageHolder}
                  preSet={project?.banner_photo}
                />
              </div>
              <div className="-mx-24 py-8 md:-mx-36">
                <TextEditor
                  updateContent={setEditorContent}
                  preSet={project?.body ? project.body : null}
                />
              </div>

              <div className="flex flex-row justify-evenly">
                <Checkbox
                  className="my-4"
                  id="publicSet"
                  isSelected={publishing}
                  onChange={() => setPublishing(!publishing)}
                  color={"primary"}
                >
                  Publish?
                </Checkbox>
                <div className="flex justify-end">
                  {publishing ? (
                    <Button
                      auto
                      shadow
                      color={"gradient"}
                      size={"xl"}
                      css={{ zIndex: 0 }}
                      onClick={postProject}
                    >
                      Post!
                    </Button>
                  ) : (
                    <Button
                      auto
                      shadow
                      color={"primary"}
                      size={"xl"}
                      css={{ zIndex: 0 }}
                      onClick={saveAsDraft}
                    >
                      Save draft
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
