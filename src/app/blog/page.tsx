import { format } from 'date-fns';
import { getAllPosts } from '@/lib/mdx';
import {
  Flex,
  Heading,
  SmartImage,
  SmartLink,
  Tag,
  Text,
  RevealFx,
} from '@/once-ui/components';

export const revalidate = 3600;

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <Flex
      as="div"
      direction="column"
      className="container"
      paddingY="48"
      gap="32"
    >
      <Heading as="h1" variant="display-strong-l">
        Blog Posts
      </Heading>
      <Flex as="div" gap="24" direction="column">
        {posts.map(post => (
          <RevealFx speed="medium" delay={0} translateY={0} key={post.id}>
            <SmartLink
              style={{
                textDecoration: 'none',
                margin: '0',
                height: 'fit-content',
              }}
              href={`/blog/posts/${post.slug}`}
            >
              <Flex
                position="relative"
                mobileDirection="column"
                fillWidth
                paddingY="12"
                paddingX="16"
                gap="32"
              >
                <Flex maxWidth={20} fillWidth>
                  <SmartImage
                    priority
                    sizes="640px"
                    style={{
                      cursor: 'pointer',
                      border: '1px solid var(--neutral-alpha-weak)',
                    }}
                    radius="m"
                    src={post.image}
                    alt={post.title}
                    aspectRatio="16/9"
                  />
                </Flex>
                <Flex
                  position="relative"
                  fillWidth
                  gap="8"
                  direction="column"
                  justifyContent="center"
                >
                  <Heading as="h2" variant="heading-strong-l" wrap="balance">
                    {post.title}
                  </Heading>
                  <Text variant="label-default-s" onBackground="neutral-weak">
                    {format(new Date(post.published_at), 'MMMM d, yyyy')} •{' '}
                    {post.author}
                  </Text>
                  <Text variant="body-default-m" onBackground="neutral-weak">
                    {post.summary}
                  </Text>
                </Flex>
              </Flex>
            </SmartLink>
          </RevealFx>
        ))}
      </Flex>
    </Flex>
  );
}
